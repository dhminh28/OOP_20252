package com.cospace.repository;

import com.cospace.dto.response.BookingStatusSummaryResponse;
import com.cospace.entity.Booking;
import com.cospace.enums.BookingStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select booking
            from Booking booking
            where booking.id = :id and booking.member.id = :memberId
            """)
    Optional<Booking> findByIdAndMemberIdForUpdate(
            @Param("id") Long id,
            @Param("memberId") Long memberId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select booking from Booking booking where booking.id = :id")
    Optional<Booking> findByIdForUpdate(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"workspace", "member"})
    @Query("""
            select booking
            from Booking booking
            where booking.workspace.id = :workspaceId
              and booking.status in :statuses
              and booking.startTime < :maintenanceEnd
              and booking.endTime > :maintenanceStart
            """)
    List<Booking> findAffectedBookingsForUpdate(
            @Param("workspaceId") Long workspaceId,
            @Param("statuses") Collection<BookingStatus> statuses,
            @Param("maintenanceStart") LocalDateTime maintenanceStart,
            @Param("maintenanceEnd") LocalDateTime maintenanceEnd
    );

    boolean existsByWorkspaceIdAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            Long workspaceId,
            Collection<BookingStatus> statuses,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    long countByStatus(BookingStatus status);

    @Query("""
            select count(distinct booking.workspace.id)
            from Booking booking
            where booking.status in (
                com.cospace.enums.BookingStatus.SUCCESS,
                com.cospace.enums.BookingStatus.CONFIRMED
            )
              and :now between booking.startTime and booking.endTime
            """)
    long countActiveWorkspacesAt(@Param("now") LocalDateTime now);

    @Query("""
            select new com.cospace.dto.response.BookingStatusSummaryResponse(booking.status, count(booking))
            from Booking booking
            group by booking.status
            """)
    List<BookingStatusSummaryResponse> countGroupByStatus();
}
