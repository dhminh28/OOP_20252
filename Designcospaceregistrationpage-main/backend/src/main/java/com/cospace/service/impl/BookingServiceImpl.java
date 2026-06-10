package com.cospace.service.impl;

import com.cospace.dto.request.BookingRequest;
import com.cospace.dto.response.BookingResponse;
import com.cospace.entity.Booking;
import com.cospace.entity.Member;
import com.cospace.entity.Workspace;
import com.cospace.enums.BookingStatus;
import com.cospace.enums.WorkspaceStatus;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ConflictException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.BookingRepository;
import com.cospace.repository.MemberRepository;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.BookingService;
import com.cospace.service.EmailService;
import com.cospace.service.NotificationService;
import com.cospace.service.WalletService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
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
    private final NotificationService notificationService;
    private final Clock clock;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            MemberRepository memberRepository,
            WorkspaceRepository workspaceRepository,
            WalletService walletService,
            EmailService emailService,
            NotificationService notificationService,
            Clock clock
    ) {
        this.bookingRepository = bookingRepository;
        this.memberRepository = memberRepository;
        this.workspaceRepository = workspaceRepository;
        this.walletService = walletService;
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.clock = clock;
    }

    @Override
    @Transactional
    public BookingResponse create(Long memberId, BookingRequest request) {
        validateBookingTime(request);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Workspace workspace = workspaceRepository.findByIdForUpdate(request.workspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
        if (workspace.getStatus() != WorkspaceStatus.AVAILABLE) {
            throw new BusinessException("Workspace is not available for booking");
        }

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
        emailService.sendBookingConfirmation(
                member.getEmail(),
                savedBooking.getId(),
                workspace.getName(),
                savedBooking.getStartTime(),
                savedBooking.getEndTime(),
                savedBooking.getTotalAmount()
        );
        notificationService.sendNotification(
                memberId,
                "Đặt chỗ thành công",
                "Bạn đã đặt " + workspace.getName() + " thành công từ "
                        + savedBooking.getStartTime() + " đến "
                        + savedBooking.getEndTime() + "."
        );

        return toResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getMyBookings(Long memberId, Pageable pageable) {
        return bookingRepository.findByMemberId(memberId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional
    public BookingResponse cancel(Long memberId, Long bookingId, String reason) {
        Booking booking = bookingRepository.findByIdAndMemberIdForUpdate(bookingId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BusinessException("Booking is already cancelled");
        }

        boolean refunded = booking.getStatus() == BookingStatus.SUCCESS
                || booking.getStatus() == BookingStatus.CONFIRMED;
        if (refunded) {
            walletService.refundFunds(memberId, booking.getTotalAmount());
        }

        booking.setNote(appendCancelReason(booking.getNote(), reason));
        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendNotification(
                memberId,
                "Đã hủy lịch đặt chỗ",
                refunded
                        ? "Bạn đã hủy đặt phòng " + booking.getWorkspace().getName()
                        + " thành công. Số tiền "
                        + formatAmount(booking.getTotalAmount())
                        + " VND đã được hoàn lại vào ví."
                        : "Bạn đã hủy đặt phòng "
                        + booking.getWorkspace().getName() + " thành công."
        );
        return toResponse(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponse cancelByAdmin(Long bookingId, String reason) {
        Booking booking = bookingRepository.findByIdForUpdate(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BusinessException("Booking is already cancelled");
        }

        boolean refunded = booking.getStatus() == BookingStatus.SUCCESS
                || booking.getStatus() == BookingStatus.CONFIRMED;
        Long memberId = booking.getMember().getId();
        if (refunded) {
            walletService.refundFunds(memberId, booking.getTotalAmount());
        }

        booking.setNote(appendAdminCancelReason(booking.getNote(), reason));
        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendNotification(
                memberId,
                "Lịch đặt chỗ đã bị Admin hủy",
                "Lịch đặt phòng " + booking.getWorkspace().getName()
                        + " của bạn đã bị Admin hủy. Lý do: " + reason.trim()
                        + (refunded
                        ? ". Số tiền " + formatAmount(booking.getTotalAmount())
                        + " VND đã được hoàn trả."
                        : ".")
        );
        return toResponse(savedBooking);
    }

    private String appendCancelReason(String currentNote, String reason) {
        if (reason == null || reason.isBlank()) {
            return currentNote;
        }

        String cancelNote = "Cancel reason: " + reason.trim();
        if (currentNote == null || currentNote.isBlank()) {
            return cancelNote;
        }
        return currentNote + "\n" + cancelNote;
    }

    private String appendAdminCancelReason(String currentNote, String reason) {
        String cancelNote = "Admin cancel reason: " + reason.trim();
        if (currentNote == null || currentNote.isBlank()) {
            return cancelNote;
        }
        return currentNote + "\n" + cancelNote;
    }

    private String formatAmount(java.math.BigDecimal amount) {
        return amount.stripTrailingZeros().toPlainString();
    }

    private void validateBookingTime(BookingRequest request) {
        if (!request.startTime().isBefore(request.endTime())) {
            throw new BusinessException("Booking start time must be before end time");
        }
        if (!request.startTime().isAfter(LocalDateTime.now(clock))) {
            throw new BusinessException("Booking start time must be in the future");
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
