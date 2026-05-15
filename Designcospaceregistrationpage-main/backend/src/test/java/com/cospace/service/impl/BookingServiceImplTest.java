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
import com.cospace.repository.BookingRepository;
import com.cospace.repository.MemberRepository;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.EmailService;
import com.cospace.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    private BookingServiceImpl bookingService;

    @BeforeEach
    void setUp() {
        bookingService = new BookingServiceImpl(bookingRepository, memberRepository, workspaceRepository, walletService, emailService);
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
        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));
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
        verify(walletService, never()).deductFunds(any(), any());
        verify(emailService, never()).sendBookingConfirmation(any());
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
        Workspace workspace = meetingRoom(workspaceId);

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));
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
        verify(walletService).deductFunds(eq(memberId), eq(new BigDecimal("540000.0")));
        verify(bookingRepository).save(any(Booking.class));
        verify(emailService).sendBookingConfirmation(any(Booking.class));
    }

    @Test
    void create_whenEndTimeIsNotAfterStartTime_throwsBusinessExceptionBeforeDatabaseAccess() {
        LocalDateTime start = LocalDateTime.of(2026, 5, 14, 12, 0);
        BookingRequest request = new BookingRequest(10L, start, start, null);

        assertThatThrownBy(() -> bookingService.create(1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Booking start time must be before end time");

        verify(memberRepository, never()).findById(any());
        verify(workspaceRepository, never()).findById(any());
        verify(bookingRepository, never()).save(any());
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
}
