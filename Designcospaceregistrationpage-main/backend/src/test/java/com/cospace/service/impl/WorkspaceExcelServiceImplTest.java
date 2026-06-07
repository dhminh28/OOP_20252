package com.cospace.service.impl;

import com.cospace.dto.request.WorkspaceRequest;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.WorkspaceService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class WorkspaceExcelServiceImplTest {

    @Mock
    private WorkspaceService workspaceService;

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Test
    void importWorkspaces_withThreeValidRows_createsThreeWorkspaces() throws Exception {
        WorkspaceExcelServiceImpl service = new WorkspaceExcelServiceImpl(
                workspaceService,
                workspaceRepository
        );
        MockMultipartFile file = createWorkbookFile();

        int imported = service.importWorkspaces(file);

        assertThat(imported).isEqualTo(3);
        ArgumentCaptor<WorkspaceRequest> requestCaptor =
                ArgumentCaptor.forClass(WorkspaceRequest.class);
        verify(workspaceService, times(3)).create(requestCaptor.capture());
        assertThat(requestCaptor.getAllValues())
                .extracting(WorkspaceRequest::name)
                .containsExactly("Desk 201", "Meeting Room B", "Private Office 02");
        assertThat(requestCaptor.getAllValues().get(1).equipment())
                .containsExactly("WiFi", "Projector");
    }

    private MockMultipartFile createWorkbookFile() throws Exception {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Workspaces");
            Row header = sheet.createRow(0);
            String[] headers = {
                    "Name", "Type", "Address", "Floor", "Capacity",
                    "Price Per Hour", "Status", "Image URL", "Equipment"
            };
            for (int index = 0; index < headers.length; index++) {
                header.createCell(index).setCellValue(headers[index]);
            }
            addRow(sheet, 1, "Desk 201", "HOT_DESK", "BMT Building", "2", 1, 50000, "AVAILABLE", "WiFi");
            addRow(sheet, 2, "Meeting Room B", "MEETING_ROOM", "BMT Building", "3", 8, 150000, "AVAILABLE", "WiFi, Projector");
            addRow(sheet, 3, "Private Office 02", "PRIVATE_OFFICE", "BMT Building", "4", 4, 200000, "AVAILABLE", "WiFi");
            workbook.write(output);
            return new MockMultipartFile(
                    "file",
                    "workspaces.xlsx",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    output.toByteArray()
            );
        }
    }

    private void addRow(
            Sheet sheet,
            int rowIndex,
            String name,
            String type,
            String address,
            String floor,
            int capacity,
            double price,
            String status,
            String equipment
    ) {
        Row row = sheet.createRow(rowIndex);
        row.createCell(0).setCellValue(name);
        row.createCell(1).setCellValue(type);
        row.createCell(2).setCellValue(address);
        row.createCell(3).setCellValue(floor);
        row.createCell(4).setCellValue(capacity);
        row.createCell(5).setCellValue(price);
        row.createCell(6).setCellValue(status);
        row.createCell(8).setCellValue(equipment);
    }
}
