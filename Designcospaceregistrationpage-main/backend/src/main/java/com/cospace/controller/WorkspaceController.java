package com.cospace.controller;

import com.cospace.dto.request.WorkspaceRequest;
import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.WorkspaceResponse;
import com.cospace.enums.WorkspaceType;
import com.cospace.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public ApiResponse<Page<WorkspaceResponse>> getAll(
            @RequestParam(required = false) WorkspaceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 9, sort = "id") Pageable pageable
    ) {
        return ApiResponse.ok(workspaceService.getAll(type, minCapacity, maxPrice, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<WorkspaceResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(workspaceService.getById(id));
    }

    @PostMapping
    public ApiResponse<WorkspaceResponse> create(@Valid @RequestBody WorkspaceRequest request) {
        return ApiResponse.ok(workspaceService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<WorkspaceResponse> update(@PathVariable Long id, @Valid @RequestBody WorkspaceRequest request) {
        return ApiResponse.ok(workspaceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        workspaceService.delete(id);
        return ApiResponse.ok(null);
    }
}
