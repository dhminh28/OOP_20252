package com.cospace.repository;

import com.cospace.entity.Workspace;
import com.cospace.enums.WorkspaceStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;

import java.util.Optional;
import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long>, JpaSpecificationExecutor<Workspace> {
    @Override
    @EntityGraph(attributePaths = "equipment")
    Page<Workspace> findAll(@Nullable Specification<Workspace> specification, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select w from Workspace w where w.id = :id")
    Optional<Workspace> findByIdForUpdate(@Param("id") Long id);

    @EntityGraph(attributePaths = "equipment")
    List<Workspace> findAllByStatusNotOrderByIdAsc(WorkspaceStatus status);

    long countByStatusNot(WorkspaceStatus status);
}
