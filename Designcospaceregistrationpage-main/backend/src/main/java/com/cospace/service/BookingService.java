package com.cospace.service;

import com.cospace.dto.request.BookingRequest;
import com.cospace.dto.response.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponse create(Long memberId, BookingRequest request);

    Page<BookingResponse> getMyBookings(Long memberId, Pageable pageable);

    BookingResponse cancel(Long memberId, Long bookingId, String reason);
}
