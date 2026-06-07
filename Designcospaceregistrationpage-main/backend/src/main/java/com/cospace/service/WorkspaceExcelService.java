package com.cospace.service;

import org.springframework.web.multipart.MultipartFile;

public interface WorkspaceExcelService {

    int importWorkspaces(MultipartFile file);

    byte[] exportWorkspaces();
}
