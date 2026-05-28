import { apiFetch } from './api';
import type { Workspace, WorkspaceStatus, WorkspaceType } from '../types/workspace';
import type { PageResponse } from '../types/pagination';

interface BackendWorkspace {
  id: number;
  name: string;
  type: 'HOT_DESK' | 'MEETING_ROOM' | 'PRIVATE_OFFICE';
  address: string;
  floor?: string | null;
  capacity?: number | null;
  pricePerHour: number;
  status: 'AVAILABLE' | 'BUSY' | 'MAINTENANCE';
  imageUrl?: string | null;
  equipment: string[];
}

export interface WorkspaceMutationPayload {
  name: string;
  type: WorkspaceType;
  address: string;
  floor?: string;
  capacity: number;
  pricePerHour: number;
  status?: WorkspaceStatus;
  imageUrl?: string;
  equipment?: string[];
}

export interface WorkspaceQuery {
  page?: number;
  size?: number;
  type?: WorkspaceType | 'All';
  minCapacity?: number | '';
  maxPrice?: number | '';
}

export async function getAllWorkspaces(query: WorkspaceQuery = {}) {
  const params = new URLSearchParams();
  params.set('page', String(query.page ?? 0));
  params.set('size', String(query.size ?? 9));
  params.set('sort', 'id,asc');

  const backendType = query.type && query.type !== 'All' ? toBackendType(query.type) : null;
  if (backendType) {
    params.set('type', backendType);
  }
  if (query.minCapacity !== undefined && query.minCapacity !== '') {
    params.set('minCapacity', String(query.minCapacity));
  }
  if (query.maxPrice !== undefined && query.maxPrice !== '') {
    params.set('maxPrice', String(query.maxPrice));
  }

  const page = await apiFetch<PageResponse<BackendWorkspace>>(`/workspaces?${params.toString()}`);
  return {
    ...page,
    content: page.content.map(mapWorkspace),
  };
}

export async function getWorkspaceById(id: number) {
  const workspace = await apiFetch<BackendWorkspace>(`/workspaces/${id}`);
  return mapWorkspace(workspace);
}

export async function createWorkspace(payload: WorkspaceMutationPayload) {
  const workspace = await apiFetch<BackendWorkspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify(toBackendWorkspacePayload(payload)),
  });
  return mapWorkspace(workspace);
}

export async function updateWorkspace(id: number, payload: WorkspaceMutationPayload) {
  const workspace = await apiFetch<BackendWorkspace>(`/workspaces/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toBackendWorkspacePayload(payload)),
  });
  return mapWorkspace(workspace);
}

export function deleteWorkspace(id: number) {
  return apiFetch<void>(`/workspaces/${id}`, {
    method: 'DELETE',
  });
}

function mapWorkspace(workspace: BackendWorkspace): Workspace {
  const type = mapType(workspace.type);

  return {
    id: workspace.id,
    name: workspace.name,
    type,
    address: workspace.address,
    rawFloor: workspace.floor ?? '',
    floor: formatLocation(workspace.floor, workspace.address),
    capacity: workspace.capacity ?? 0,
    pricePerHour: Number(workspace.pricePerHour),
    status: mapStatus(workspace.status),
    equipment: workspace.equipment ?? [],
    image: workspace.imageUrl || getFallbackImage(type),
  };
}

function mapType(type: BackendWorkspace['type']): WorkspaceType {
  const map: Record<BackendWorkspace['type'], WorkspaceType> = {
    HOT_DESK: 'Hot Desk',
    MEETING_ROOM: 'Meeting Room',
    PRIVATE_OFFICE: 'Private Office',
  };
  return map[type];
}

function toBackendType(type: WorkspaceType): BackendWorkspace['type'] {
  const map: Record<WorkspaceType, BackendWorkspace['type']> = {
    'Hot Desk': 'HOT_DESK',
    'Meeting Room': 'MEETING_ROOM',
    'Private Office': 'PRIVATE_OFFICE',
  };
  return map[type];
}

function toBackendStatus(status: WorkspaceStatus | undefined): BackendWorkspace['status'] | undefined {
  if (!status) {
    return undefined;
  }
  const map: Record<WorkspaceStatus, BackendWorkspace['status']> = {
    available: 'AVAILABLE',
    busy: 'BUSY',
    maintenance: 'MAINTENANCE',
  };
  return map[status];
}

function toBackendWorkspacePayload(payload: WorkspaceMutationPayload) {
  return {
    name: payload.name,
    type: toBackendType(payload.type),
    address: payload.address,
    floor: payload.floor,
    capacity: payload.capacity,
    pricePerHour: payload.pricePerHour,
    status: toBackendStatus(payload.status),
    imageUrl: payload.imageUrl,
    equipment: payload.equipment ?? [],
  };
}

function mapStatus(status: BackendWorkspace['status']): WorkspaceStatus {
  const map: Record<BackendWorkspace['status'], WorkspaceStatus> = {
    AVAILABLE: 'available',
    BUSY: 'busy',
    MAINTENANCE: 'maintenance',
  };
  return map[status];
}

function formatLocation(floor: string | null | undefined, address: string) {
  return floor ? `Tang ${floor}, ${address}` : address;
}

function getFallbackImage(type: WorkspaceType) {
  const images: Record<WorkspaceType, string> = {
    'Hot Desk': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    'Meeting Room': 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    'Private Office': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  };
  return images[type];
}
