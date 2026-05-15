package com.cospace.service;

import com.cospace.dto.request.WorkspaceRequest;
import com.cospace.dto.response.WorkspaceResponse;
import com.cospace.enums.WorkspaceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface WorkspaceService {
    Page<WorkspaceResponse> getAll(WorkspaceType type, Integer minCapacity, BigDecimal maxPrice, Pageable pageable);

    WorkspaceResponse getById(Long id);

    WorkspaceResponse create(WorkspaceRequest request);

    WorkspaceResponse update(Long id, WorkspaceRequest request);

    void delete(Long id);
}
