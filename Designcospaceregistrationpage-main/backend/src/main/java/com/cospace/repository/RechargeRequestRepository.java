package com.cospace.repository;

import com.cospace.entity.RechargeRequest;
import com.cospace.enums.RechargeRequestStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RechargeRequestRepository extends JpaRepository<RechargeRequest, Long> {

    @EntityGraph(attributePaths = "member")
    Page<RechargeRequest> findByStatus(RechargeRequestStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "member")
    Page<RechargeRequest> findByMemberId(Long memberId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select request from RechargeRequest request where request.id = :id")
    Optional<RechargeRequest> findByIdForUpdate(@Param("id") Long id);
}
