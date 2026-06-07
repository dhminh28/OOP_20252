package com.cospace.service.impl;

import com.cospace.dto.request.WorkspaceMaintenanceRequest;
import com.cospace.entity.Booking;
import com.cospace.entity.MeetingRoom;
import com.cospace.entity.Member;
import com.cospace.enums.BookingStatus;
import com.cospace.enums.WorkspaceStatus;
import com.cospace.repository.BookingRepository;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.NotificationService;
import com.cospace.service.WalletService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkspaceMaintenanceServiceImplTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private WalletService walletService;

    @Mock
    private NotificationService notificationService;

    @Test
    void scheduleMaintenance_withTwoAffectedBookings_refundsAndNotifiesBothMembers() {
        WorkspaceMaintenanceServiceImpl service = new WorkspaceMaintenanceServiceImpl(
                workspaceRepository,
                bookingRepository,
                walletService,
                notificationService
        );
        MeetingRoom workspace = new MeetingRoom();
        ReflectionTestUtils.setField(workspace, "id", 10L);
        workspace.setName("Meeting Room A");
        Booking firstBooking = booking(101L, 1L, workspace, "150000");
        Booking secondBooking = booking(102L, 2L, workspace, "200000");
        LocalDateTime start = LocalDateTime.of(2026, 6, 8, 9, 0);
        LocalDateTime end = LocalDateTime.of(2026, 6, 8, 12, 0);
        WorkspaceMaintenanceRequest request =
                new WorkspaceMaintenanceRequest(start, end, "Bảo trì điều hòa");

        when(workspaceRepository.findByIdForUpdate(10L))
                .thenReturn(Optional.of(workspace));
        when(bookingRepository.findAffectedBookingsForUpdate(
                eq(10L),
                anyCollection(),
                eq(start),
                eq(end)
        )).thenReturn(List.of(firstBooking, secondBooking));

        var response = service.scheduleMaintenance(10L, request);

        assertThat(response.cancelledBookings()).isEqualTo(2);
        assertThat(response.refundedAmount()).isEqualByComparingTo("350000");
        assertThat(workspace.getStatus()).isEqualTo(WorkspaceStatus.MAINTENANCE);
        assertThat(firstBooking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(secondBooking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        verify(walletService).refundFunds(1L, new BigDecimal("150000"));
        verify(walletService).refundFunds(2L, new BigDecimal("200000"));
        verify(notificationService, times(2))
                .sendNotification(any(), any(), any());
        verify(bookingRepository, times(2)).save(any(Booking.class));
        verify(workspaceRepository).save(workspace);
    }

    private Booking booking(
            Long bookingId,
            Long memberId,
            MeetingRoom workspace,
            String amount
    ) {
        Member member = new Member();
        ReflectionTestUtils.setField(member, "id", memberId);
        Booking booking = new Booking();
        ReflectionTestUtils.setField(booking, "id", bookingId);
        ReflectionTestUtils.setField(booking, "totalAmount", new BigDecimal(amount));
        booking.setMember(member);
        booking.setWorkspace(workspace);
        booking.setStatus(BookingStatus.SUCCESS);
        return booking;
    }
}
