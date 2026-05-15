package com.cospace.service.impl;

import com.cospace.dto.request.WorkspaceRequest;
import com.cospace.dto.response.WorkspaceResponse;
import com.cospace.entity.Equipment;
import com.cospace.entity.HotDesk;
import com.cospace.entity.MeetingRoom;
import com.cospace.entity.PrivateOffice;
import com.cospace.entity.Workspace;
import com.cospace.enums.WorkspaceType;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.repository.specification.WorkspaceSpecifications;
import com.cospace.service.WorkspaceService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
            value = "workspaces",
            key = "{#type, #minCapacity, #maxPrice, #pageable.pageNumber, #pageable.pageSize, #pageable.sort.toString()}"
    )
    public Page<WorkspaceResponse> getAll(
            WorkspaceType type,
            Integer minCapacity,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        return workspaceRepository.findAll(
                        WorkspaceSpecifications.withFilters(type, minCapacity, maxPrice),
                        pageable
                )
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceResponse getById(Long id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        return toResponse(workspace);
    }

    @Override
    @CacheEvict(value = "workspaces", allEntries = true)
    @Transactional
    public WorkspaceResponse create(WorkspaceRequest request) {
        Workspace workspace = createWorkspaceByType(request.type());
        applyRequest(workspace, request);
        return toResponse(workspaceRepository.save(workspace));
    }

    @Override
    @CacheEvict(value = "workspaces", allEntries = true)
    @Transactional
    public WorkspaceResponse update(Long id, WorkspaceRequest request) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
        if (workspace.getType() != request.type()) {
            throw new BusinessException("Workspace type cannot be changed after creation");
        }

        applyRequest(workspace, request);
        return toResponse(workspaceRepository.save(workspace));
    }

    @Override
    @CacheEvict(value = "workspaces", allEntries = true)
    @Transactional
    public void delete(Long id) {
        if (!workspaceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workspace not found");
        }
        workspaceRepository.deleteById(id);
    }

    private Workspace createWorkspaceByType(WorkspaceType type) {
        return switch (type) {
            case HOT_DESK -> new HotDesk();
            case MEETING_ROOM -> new MeetingRoom();
            case PRIVATE_OFFICE -> new PrivateOffice();
        };
    }

    private void applyRequest(Workspace workspace, WorkspaceRequest request) {
        workspace.setName(request.name());
        workspace.setAddress(request.address());
        workspace.setFloor(request.floor());
        workspace.setCapacity(request.capacity());
        workspace.setPricePerHour(request.pricePerHour());
        if (request.status() != null) {
            workspace.setStatus(request.status());
        }
        workspace.setImageUrl(request.imageUrl());

        workspace.getEquipment().clear();
        List<String> equipmentNames = request.equipment() == null ? List.of() : request.equipment();
        for (String equipmentName : equipmentNames) {
            Equipment equipment = new Equipment();
            equipment.setName(equipmentName);
            equipment.setWorkspace(workspace);
            workspace.getEquipment().add(equipment);
        }
    }

    private WorkspaceResponse toResponse(Workspace workspace) {
        List<String> equipment = workspace.getEquipment().stream()
                .map(item -> item.getName())
                .toList();

        return new WorkspaceResponse(
                workspace.getId(),
                workspace.getName(),
                workspace.getType(),
                workspace.getAddress(),
                workspace.getFloor(),
                workspace.getCapacity(),
                workspace.getPricePerHour(),
                workspace.getStatus(),
                workspace.getImageUrl(),
                equipment
        );
    }
}
