package com.cospace.service.impl;

import com.cospace.dto.request.WorkspaceMaintenanceRequest;
import com.cospace.dto.response.WorkspaceMaintenanceResponse;
import com.cospace.entity.Booking;
import com.cospace.entity.Workspace;
import com.cospace.enums.BookingStatus;
import com.cospace.enums.WorkspaceStatus;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.BookingRepository;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.NotificationService;
import com.cospace.service.WalletService;
import com.cospace.service.WorkspaceMaintenanceService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class WorkspaceMaintenanceServiceImpl implements WorkspaceMaintenanceService {

    private static final List<BookingStatus> REFUNDABLE_STATUSES = List.of(
            BookingStatus.SUCCESS,
            BookingStatus.CONFIRMED
    );
    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final WorkspaceRepository workspaceRepository;
    private final BookingRepository bookingRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    public WorkspaceMaintenanceServiceImpl(
            WorkspaceRepository workspaceRepository,
            BookingRepository bookingRepository,
            WalletService walletService,
            NotificationService notificationService
    ) {
        this.workspaceRepository = workspaceRepository;
        this.bookingRepository = bookingRepository;
        this.walletService = walletService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    @CacheEvict(value = "workspaces", allEntries = true)
    public WorkspaceMaintenanceResponse scheduleMaintenance(
            Long workspaceId,
            WorkspaceMaintenanceRequest request
    ) {
        if (!request.startTime().isBefore(request.endTime())) {
            throw new BusinessException("Maintenance start time must be before end time");
        }

        Workspace workspace = workspaceRepository.findByIdForUpdate(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
        if (workspace.getStatus() == WorkspaceStatus.ARCHIVED) {
            throw new BusinessException("Archived workspace cannot enter maintenance");
        }

        List<Booking> affectedBookings = bookingRepository.findAffectedBookingsForUpdate(
                workspaceId,
                REFUNDABLE_STATUSES,
                request.startTime(),
                request.endTime()
        );

        BigDecimal refundedAmount = BigDecimal.ZERO;
        for (Booking booking : affectedBookings) {
            Long memberId = booking.getMember().getId();
            walletService.refundFunds(memberId, booking.getTotalAmount());
            refundedAmount = refundedAmount.add(booking.getTotalAmount());
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setNote(appendMaintenanceReason(booking.getNote(), request.reason()));
            bookingRepository.save(booking);
            notificationService.sendNotification(
                    memberId,
                    "Lịch đặt chỗ bị hủy do bảo trì",
                    "Không gian " + workspace.getName() + " được bảo trì từ "
                            + request.startTime().format(DATE_TIME_FORMATTER) + " đến "
                            + request.endTime().format(DATE_TIME_FORMATTER)
                            + ". Lịch đặt chỗ của bạn đã bị hủy và "
                            + booking.getTotalAmount().stripTrailingZeros().toPlainString()
                            + " VND đã được hoàn lại vào ví. Lý do: "
                            + request.reason().trim()
            );
        }

        workspace.setStatus(WorkspaceStatus.MAINTENANCE);
        workspaceRepository.save(workspace);
        return new WorkspaceMaintenanceResponse(
                workspace.getId(),
                workspace.getName(),
                request.startTime(),
                request.endTime(),
                affectedBookings.size(),
                refundedAmount
        );
    }

    private String appendMaintenanceReason(String currentNote, String reason) {
        String note = "Maintenance cancellation: " + reason.trim();
        return currentNote == null || currentNote.isBlank()
                ? note
                : currentNote + "\n" + note;
    }
}
