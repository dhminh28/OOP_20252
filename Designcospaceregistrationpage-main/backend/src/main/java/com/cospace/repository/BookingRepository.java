package com.cospace.repository;

import com.cospace.dto.response.BookingStatusSummaryResponse;
import com.cospace.entity.Booking;
import com.cospace.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Override
    @EntityGraph(attributePaths = {"workspace", "member"})
    Page<Booking> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "workspace")
    Page<Booking> findByMemberId(Long memberId, Pageable pageable);

    @EntityGraph(attributePaths = "workspace")
    Optional<Booking> findByIdAndMemberId(Long id, Long memberId);

    boolean existsByWorkspaceIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            Long workspaceId,
            Collection<BookingStatus> statuses,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    long countByStatus(BookingStatus status);

    @Query("""
            select new com.cospace.dto.response.BookingStatusSummaryResponse(booking.status, count(booking))
            from Booking booking
            group by booking.status
            """)
    List<BookingStatusSummaryResponse> countGroupByStatus();
}
