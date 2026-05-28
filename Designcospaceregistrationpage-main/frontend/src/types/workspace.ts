export type WorkspaceType = 'Hot Desk' | 'Meeting Room' | 'Private Office';
export type WorkspaceStatus = 'available' | 'busy' | 'maintenance';

export interface Workspace {
  id: number;
  name: string;
  type: WorkspaceType;
  address?: string;
  rawFloor?: string;
  floor: string;
  capacity: number;
  pricePerHour: number;
  status: WorkspaceStatus;
  equipment: string[];
  image: string;
}

export interface HotDesk extends Workspace {
  type: 'Hot Desk';
}

export interface MeetingRoom extends Workspace {
  type: 'Meeting Room';
}
