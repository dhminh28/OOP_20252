package com.cospace.service.impl;

import com.cospace.dto.request.WorkspaceRequest;
import com.cospace.entity.Workspace;
import com.cospace.enums.WorkspaceStatus;
import com.cospace.enums.WorkspaceType;
import com.cospace.exception.BusinessException;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.WorkspaceExcelService;
import com.cospace.service.WorkspaceService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class WorkspaceExcelServiceImpl implements WorkspaceExcelService {

    private static final int MAX_IMPORT_ROWS = 1_000;
    private static final String[] HEADERS = {
            "Name",
            "Type",
            "Address",
            "Floor",
            "Capacity",
            "Price Per Hour",
            "Status",
            "Image URL",
            "Equipment"
    };

    private final WorkspaceService workspaceService;
    private final WorkspaceRepository workspaceRepository;

    public WorkspaceExcelServiceImpl(
            WorkspaceService workspaceService,
            WorkspaceRepository workspaceRepository
    ) {
        this.workspaceService = workspaceService;
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    @Transactional
    public int importWorkspaces(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Excel file is required");
        }
        if (file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".xlsx")) {
            throw new BusinessException("Only .xlsx files are supported");
        }

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getNumberOfSheets() == 0
                    ? null
                    : workbook.getSheetAt(0);
            if (sheet == null || sheet.getLastRowNum() < 1) {
                throw new BusinessException("Excel file does not contain workspace data");
            }
            if (sheet.getLastRowNum() > MAX_IMPORT_ROWS) {
                throw new BusinessException("Excel file cannot contain more than 1000 workspaces");
            }

            DataFormatter formatter = new DataFormatter();
            int imported = 0;
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null || isEmptyRow(row, formatter)) {
                    continue;
                }
                try {
                    workspaceService.create(toRequest(row, formatter));
                    imported++;
                } catch (RuntimeException exception) {
                    throw new BusinessException(
                            "Invalid workspace data at Excel row " + (rowIndex + 1)
                                    + ": " + exception.getMessage()
                    );
                }
            }
            if (imported == 0) {
                throw new BusinessException("Excel file does not contain valid workspace rows");
            }
            return imported;
        } catch (IOException exception) {
            throw new BusinessException("Cannot read the Excel file");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportWorkspaces() {
        List<Workspace> workspaces = workspaceRepository
                .findAllByStatusNotOrderByIdAsc(WorkspaceStatus.ARCHIVED);

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Workspaces");
            Row headerRow = sheet.createRow(0);
            for (int index = 0; index < HEADERS.length; index++) {
                headerRow.createCell(index).setCellValue(HEADERS[index]);
            }

            for (int index = 0; index < workspaces.size(); index++) {
                Workspace workspace = workspaces.get(index);
                Row row = sheet.createRow(index + 1);
                row.createCell(0).setCellValue(workspace.getName());
                row.createCell(1).setCellValue(workspace.getType().name());
                row.createCell(2).setCellValue(workspace.getAddress());
                row.createCell(3).setCellValue(valueOrEmpty(workspace.getFloor()));
                row.createCell(4).setCellValue(workspace.getCapacity() == null ? 0 : workspace.getCapacity());
                row.createCell(5).setCellValue(workspace.getPricePerHour().doubleValue());
                row.createCell(6).setCellValue(workspace.getStatus().name());
                row.createCell(7).setCellValue(valueOrEmpty(workspace.getImageUrl()));
                row.createCell(8).setCellValue(
                        String.join(", ", workspace.getEquipment().stream()
                                .map(item -> item.getName())
                                .toList())
                );
            }

            for (int index = 0; index < HEADERS.length; index++) {
                sheet.autoSizeColumn(index);
            }
            workbook.write(output);
            return output.toByteArray();
        } catch (IOException exception) {
            throw new BusinessException("Cannot create the Excel export");
        }
    }

    private WorkspaceRequest toRequest(Row row, DataFormatter formatter) {
        String name = requiredCell(row, 0, formatter, "name");
        WorkspaceType type = parseType(requiredCell(row, 1, formatter, "type"));
        String address = requiredCell(row, 2, formatter, "address");
        String floor = optionalCell(row, 3, formatter);
        Integer capacity = parsePositiveInteger(requiredCell(row, 4, formatter, "capacity"), "capacity");
        BigDecimal pricePerHour = parsePositiveDecimal(
                requiredCell(row, 5, formatter, "price per hour"),
                "price per hour"
        );
        WorkspaceStatus status = parseStatus(optionalCell(row, 6, formatter));
        String imageUrl = optionalCell(row, 7, formatter);
        List<String> equipment = parseEquipment(optionalCell(row, 8, formatter));
        return new WorkspaceRequest(
                name,
                type,
                address,
                floor,
                capacity,
                pricePerHour,
                status,
                imageUrl,
                equipment
        );
    }

    private WorkspaceType parseType(String rawValue) {
        String value = normalizeEnum(rawValue);
        return switch (value) {
            case "HOT_DESK", "HOTDESK" -> WorkspaceType.HOT_DESK;
            case "MEETING_ROOM", "MEETINGROOM" -> WorkspaceType.MEETING_ROOM;
            case "PRIVATE_OFFICE", "PRIVATEOFFICE" -> WorkspaceType.PRIVATE_OFFICE;
            default -> throw new BusinessException("Unsupported workspace type: " + rawValue);
        };
    }

    private WorkspaceStatus parseStatus(String rawValue) {
        if (rawValue == null) {
            return WorkspaceStatus.AVAILABLE;
        }
        try {
            return WorkspaceStatus.valueOf(normalizeEnum(rawValue));
        } catch (IllegalArgumentException exception) {
            throw new BusinessException("Unsupported workspace status: " + rawValue);
        }
    }

    private String normalizeEnum(String value) {
        return value.trim().toUpperCase().replace(' ', '_').replace('-', '_');
    }

    private Integer parsePositiveInteger(String value, String field) {
        try {
            int parsed = new BigDecimal(value.replace(",", "")).intValueExact();
            if (parsed <= 0) {
                throw new NumberFormatException();
            }
            return parsed;
        } catch (ArithmeticException | NumberFormatException exception) {
            throw new BusinessException(field + " must be a positive integer");
        }
    }

    private BigDecimal parsePositiveDecimal(String value, String field) {
        try {
            BigDecimal parsed = new BigDecimal(value.replace(",", ""));
            if (parsed.signum() <= 0) {
                throw new NumberFormatException();
            }
            return parsed;
        } catch (NumberFormatException exception) {
            throw new BusinessException(field + " must be greater than zero");
        }
    }

    private List<String> parseEquipment(String value) {
        if (value == null) {
            return List.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .distinct()
                .toList();
    }

    private boolean isEmptyRow(Row row, DataFormatter formatter) {
        for (int index = 0; index < HEADERS.length; index++) {
            if (!formatter.formatCellValue(row.getCell(index)).isBlank()) {
                return false;
            }
        }
        return true;
    }

    private String requiredCell(
            Row row,
            int column,
            DataFormatter formatter,
            String field
    ) {
        String value = optionalCell(row, column, formatter);
        if (value == null) {
            throw new BusinessException(field + " is required");
        }
        return value;
    }

    private String optionalCell(Row row, int column, DataFormatter formatter) {
        Cell cell = row.getCell(column);
        String value = cell == null ? "" : formatter.formatCellValue(cell).trim();
        return value.isEmpty() ? null : value;
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value;
    }
}
