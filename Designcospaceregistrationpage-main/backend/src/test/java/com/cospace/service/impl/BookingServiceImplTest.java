package com.cospace.service.impl;

import com.cospace.dto.request.BookingRequest;
import com.cospace.dto.response.BookingResponse;
import com.cospace.entity.Booking;
import com.cospace.entity.Member;
import com.cospace.entity.MeetingRoom;
import com.cospace.entity.Workspace;
import com.cospace.enums.BookingStatus;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ConflictException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.BookingRepository;
import com.cospace.repository.MemberRepository;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.EmailService;
import com.cospace.service.NotificationService;
import com.cospace.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private WalletService walletService;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    private BookingServiceImpl bookingService;
    private Clock clock;

    @BeforeEach
    void setUp() {
        clock = Clock.fixed(Instant.parse("2026-05-01T00:00:00Z"), ZoneOffset.UTC);
        bookingService = new BookingServiceImpl(
                bookingRepository,
                memberRepository,
                workspaceRepository,
                walletService,
                emailService,
                notificationService,
                clock
        );
    }

    @Test
    void create_whenWorkspaceAlreadyBooked_throwsConflictAndDoesNotChargeOrSave() {
        Long memberId = 1L;
        Long workspaceId = 10L;
        LocalDateTime start = LocalDateTime.of(2026, 5, 14, 9, 0);
        LocalDateTime end = LocalDateTime.of(2026, 5, 14, 12, 0);
        BookingRequest request = new BookingRequest(workspaceId, start, end, "Team sync");
        Member member = new Member();
        Workspace workspace = meetingRoom(workspaceId);

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(workspaceRepository.findByIdForUpdate(workspaceId)).thenReturn(Optional.of(workspace));
        when(bookingRepository.existsByWorkspaceIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                eq(workspaceId),
                anyCollection(),
                eq(end),
                eq(start)
        )).thenReturn(true);

        assertThatThrownBy(() -> bookingService.create(memberId, request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Workspace is already booked for this time slot");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<BookingStatus>> statusesCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(bookingRepository).existsByWorkspaceIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                eq(workspaceId),
                statusesCaptor.capture(),
                eq(end),
                eq(start)
        );
        assertThat(statusesCaptor.getValue())
                .containsExactlyInAnyOrder(BookingStatus.PENDING, BookingStatus.SUCCESS, BookingStatus.CONFIRMED)
                .doesNotContain(BookingStatus.CANCELLED);
        verify(workspaceRepository).findByIdForUpdate(workspaceId);
        verify(walletService, never()).deductFunds(any(), any());
        verify(emailService, never()).sendBookingConfirmation(
                any(), any(), any(), any(), any(), any()
        );
        verify(notificationService, never())
                .sendNotification(any(), any(), any());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void create_whenNoConflict_chargesWalletAndSavesSuccessfulBooking() {
        Long memberId = 1L;
        Long workspaceId = 10L;
        LocalDateTime start = LocalDateTime.of(2026, 5, 14, 9, 0);
        LocalDateTime end = LocalDateTime.of(2026, 5, 14, 13, 0);
        BookingRequest request = new BookingRequest(workspaceId, start, end, "Workshop");
        Member member = new Member();
        member.setEmail("member@cospace.vn");
        Workspace workspace = meetingRoom(workspaceId);

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(workspaceRepository.findByIdForUpdate(workspaceId)).thenReturn(Optional.of(workspace));
        when(bookingRepository.existsByWorkspaceIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                eq(workspaceId),
                anyCollection(),
                eq(end),
                eq(start)
        )).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            ReflectionTestUtils.setField(booking, "id", 99L);
            return booking;
        });

        BookingResponse response = bookingService.create(memberId, request);

        assertThat(response.id()).isEqualTo(99L);
        assertThat(response.status()).isEqualTo(BookingStatus.SUCCESS);
        assertThat(response.totalAmount()).isEqualByComparingTo("540000");
        verify(workspaceRepository).findByIdForUpdate(workspaceId);
        verify(walletService).deductFunds(eq(memberId), eq(new BigDecimal("540000.0")));
        verify(bookingRepository).save(any(Booking.class));
        verify(emailService).sendBookingConfirmation(
                "member@cospace.vn",
                99L,
                "Meeting Room A",
                start,
                end,
                new BigDecimal("540000.0")
        );
        verify(notificationService)
                .sendNotification(eq(memberId), any(String.class), any(String.class));
    }

    @Test
    void create_whenEndTimeIsNotAfterStartTime_throwsBusinessExceptionBeforeDatabaseAccess() {
        LocalDateTime start = LocalDateTime.of(2026, 5, 14, 12, 0);
        BookingRequest request = new BookingRequest(10L, start, start, null);

        assertThatThrownBy(() -> bookingService.create(1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Booking start time must be before end time");

        verify(memberRepository, never()).findById(any());
        verify(workspaceRepository, never()).findByIdForUpdate(any());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void create_whenStartTimeIsNotInFuture_throwsBusinessExceptionBeforeDatabaseAccess() {
        LocalDateTime start = LocalDateTime.of(2026, 4, 30, 12, 0);
        BookingRequest request = new BookingRequest(
                10L,
                start,
                start.plusHours(1),
                null
        );

        assertThatThrownBy(() -> bookingService.create(1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Booking start time must be in the future");

        verify(memberRepository, never()).findById(any());
        verify(workspaceRepository, never()).findByIdForUpdate(any());
        verify(bookingRepository, never()).save(any());
    }

    @ParameterizedTest
    @EnumSource(
            value = com.cospace.enums.WorkspaceStatus.class,
            names = {"BUSY", "MAINTENANCE", "ARCHIVED"}
    )
    void create_whenWorkspaceIsUnavailable_rejectsBeforeConflictAndPayment(
            com.cospace.enums.WorkspaceStatus status
    ) {
        Long memberId = 1L;
        Long workspaceId = 10L;
        LocalDateTime start = LocalDateTime.of(2026, 5, 14, 9, 0);
        BookingRequest request = new BookingRequest(
                workspaceId,
                start,
                start.plusHours(1),
                null
        );
        Member member = new Member();
        Workspace workspace = meetingRoom(workspaceId);
        workspace.setStatus(status);

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(workspaceRepository.findByIdForUpdate(workspaceId))
                .thenReturn(Optional.of(workspace));

        assertThatThrownBy(() -> bookingService.create(memberId, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Workspace is not available for booking");

        verify(bookingRepository, never())
                .existsByWorkspaceIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                        any(), anyCollection(), any(), any()
                );
        verify(walletService, never()).deductFunds(any(), any());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void cancel_whenSuccessfulBookingBelongsToMember_refundsAndUpdatesStatus() {
        Long memberId = 1L;
        Long bookingId = 99L;
        Booking booking = existingBooking(bookingId, BookingStatus.SUCCESS);

        when(bookingRepository.findByIdAndMemberIdForUpdate(bookingId, memberId)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.cancel(memberId, bookingId, "Change of plan");

        assertThat(response.id()).isEqualTo(bookingId);
        assertThat(response.status()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(response.note()).isEqualTo("Cancel reason: Change of plan");
        verify(walletService).refundFunds(memberId, new BigDecimal("150000"));
        verify(bookingRepository).save(booking);
        verify(notificationService)
                .sendNotification(eq(memberId), any(String.class), any(String.class));
    }

    @Test
    void cancel_whenConfirmedBookingBelongsToMember_refundsAndUpdatesStatus() {
        Long memberId = 1L;
        Long bookingId = 99L;
        Booking booking = existingBooking(bookingId, BookingStatus.CONFIRMED);

        when(bookingRepository.findByIdAndMemberIdForUpdate(bookingId, memberId)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.cancel(memberId, bookingId, null);

        assertThat(response.status()).isEqualTo(BookingStatus.CANCELLED);
        verify(walletService).refundFunds(memberId, new BigDecimal("150000"));
        verify(bookingRepository).save(booking);
        verify(notificationService)
                .sendNotification(eq(memberId), any(String.class), any(String.class));
    }

    @Test
    void cancel_whenPendingBookingBelongsToMember_doesNotRefundAndUpdatesStatus() {
        Long memberId = 1L;
        Long bookingId = 99L;
        Booking booking = existingBooking(bookingId, BookingStatus.PENDING);

        when(bookingRepository.findByIdAndMemberIdForUpdate(bookingId, memberId)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.cancel(memberId, bookingId, null);

        assertThat(response.status()).isEqualTo(BookingStatus.CANCELLED);
        verify(walletService, never()).refundFunds(any(), any());
        verify(bookingRepository).save(booking);
        verify(notificationService)
                .sendNotification(eq(memberId), any(String.class), any(String.class));
    }

    @Test
    void cancel_whenBookingAlreadyCancelled_throwsBusinessException() {
        Long memberId = 1L;
        Long bookingId = 99L;
        Booking booking = existingBooking(bookingId, BookingStatus.CANCELLED);

        when(bookingRepository.findByIdAndMemberIdForUpdate(bookingId, memberId)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancel(memberId, bookingId, null))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Booking is already cancelled");

        verify(walletService, never()).refundFunds(any(), any());
        verify(bookingRepository, never()).save(any());
        verify(notificationService, never())
                .sendNotification(any(), any(), any());
    }

    @Test
    void cancel_whenBookingDoesNotBelongToMember_throwsNotFound() {
        Long memberId = 1L;
        Long bookingId = 99L;

        when(bookingRepository.findByIdAndMemberIdForUpdate(bookingId, memberId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.cancel(memberId, bookingId, null))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Booking not found");

        verify(walletService, never()).refundFunds(any(), any());
        verify(bookingRepository, never()).save(any());
        verify(notificationService, never())
                .sendNotification(any(), any(), any());
    }

    @Test
    void cancelByAdmin_whenSuccessfulBooking_refundsMemberAndSendsNotification() {
        Long bookingId = 99L;
        Booking booking = existingBooking(bookingId, BookingStatus.SUCCESS);

        when(bookingRepository.findByIdForUpdate(bookingId))
                .thenReturn(Optional.of(booking));
        when(bookingRepository.save(booking)).thenReturn(booking);

        BookingResponse response = bookingService.cancelByAdmin(
                bookingId,
                "Workspace maintenance"
        );

        assertThat(response.status()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(response.note())
                .isEqualTo("Admin cancel reason: Workspace maintenance");
        verify(walletService).refundFunds(1L, new BigDecimal("150000"));
        verify(notificationService)
                .sendNotification(eq(1L), any(String.class), any(String.class));
        verify(bookingRepository).save(booking);
    }

    private MeetingRoom meetingRoom(Long id) {
        MeetingRoom room = new MeetingRoom();
        ReflectionTestUtils.setField(room, "id", id);
        room.setName("Meeting Room A");
        room.setAddress("BMT Building");
        room.setCapacity(8);
        room.setPricePerHour(new BigDecimal("150000"));
        return room;
    }

    private Booking existingBooking(Long id, BookingStatus status) {
        Booking booking = new Booking();
        ReflectionTestUtils.setField(booking, "id", id);
        ReflectionTestUtils.setField(booking, "totalAmount", new BigDecimal("150000"));
        Member member = new Member();
        ReflectionTestUtils.setField(member, "id", 1L);
        booking.setMember(member);
        booking.setWorkspace(meetingRoom(10L));
        booking.setStartTime(LocalDateTime.of(2026, 5, 14, 9, 0));
        booking.setEndTime(LocalDateTime.of(2026, 5, 14, 10, 0));
        booking.setStatus(status);
        return booking;
    }
}
