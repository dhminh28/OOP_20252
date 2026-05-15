package com.cospace.service.impl;

import com.cospace.dto.request.BookingRequest;
import com.cospace.dto.response.BookingResponse;
import com.cospace.entity.Booking;
import com.cospace.entity.Member;
import com.cospace.entity.Workspace;
import com.cospace.enums.BookingStatus;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ConflictException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.BookingRepository;
import com.cospace.repository.MemberRepository;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.BookingService;
import com.cospace.service.EmailService;
import com.cospace.service.WalletService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private static final List<BookingStatus> ACTIVE_BOOKING_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.SUCCESS,
            BookingStatus.CONFIRMED
    );

    private final BookingRepository bookingRepository;
    private final MemberRepository memberRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WalletService walletService;
    private final EmailService emailService;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            MemberRepository memberRepository,
            WorkspaceRepository workspaceRepository,
            WalletService walletService,
            EmailService emailService
    ) {
        this.bookingRepository = bookingRepository;
        this.memberRepository = memberRepository;
        this.workspaceRepository = workspaceRepository;
        this.walletService = walletService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public BookingResponse create(Long memberId, BookingRequest request) {
        validateBookingTime(request);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Workspace workspace = workspaceRepository.findById(request.workspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        boolean hasConflict = bookingRepository.existsByWorkspaceIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                request.workspaceId(),
                ACTIVE_BOOKING_STATUSES,
                request.endTime(),
                request.startTime()
        );
        if (hasConflict) {
            throw new ConflictException("Workspace is already booked for this time slot");
        }

        Booking booking = new Booking();
        booking.setMember(member);
        booking.setWorkspace(workspace);
        booking.setStartTime(request.startTime());
        booking.setEndTime(request.endTime());
        booking.setNote(request.note());
        booking.calculateTotal();

        walletService.deductFunds(memberId, booking.getTotalAmount());

        booking.setStatus(BookingStatus.SUCCESS);
        Booking savedBooking = bookingRepository.save(booking);
        emailService.sendBookingConfirmation(savedBooking);

        return toResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getMyBookings(Long memberId, Pageable pageable) {
        return bookingRepository.findByMemberId(memberId, pageable)
                .map(this::toResponse);
    }

    @Override
    public BookingResponse cancel(Long memberId, Long bookingId) {
        return new BookingResponse(bookingId, null, null, null, null, BigDecimal.ZERO, BookingStatus.CANCELLED, null);
    }

    private void validateBookingTime(BookingRequest request) {
        if (!request.startTime().isBefore(request.endTime())) {
            throw new BusinessException("Booking start time must be before end time");
        }
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getWorkspace().getId(),
                booking.getWorkspace().getName(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getTotalAmount(),
                booking.getStatus(),
                booking.getNote()
        );
    }
}
