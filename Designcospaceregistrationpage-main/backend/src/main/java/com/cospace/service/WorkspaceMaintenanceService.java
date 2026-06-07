package com.cospace.service;

import com.cospace.dto.request.WorkspaceMaintenanceRequest;
import com.cospace.dto.response.WorkspaceMaintenanceResponse;

public interface WorkspaceMaintenanceService {

    WorkspaceMaintenanceResponse scheduleMaintenance(
            Long workspaceId,
            WorkspaceMaintenanceRequest request
    );
}
