package com.cospace.repository.specification;

import com.cospace.entity.Workspace;
import com.cospace.enums.WorkspaceStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkspaceSpecificationsTest {

    @Mock
    private Root<Workspace> root;

    @Mock
    private CriteriaQuery<?> query;

    @Mock
    private CriteriaBuilder criteriaBuilder;

    @Mock
    private Path<WorkspaceStatus> statusPath;

    @Mock
    private Predicate predicate;

    @Test
    void isNotArchived_excludesArchivedStatus() {
        when(root.<WorkspaceStatus>get("status")).thenReturn(statusPath);
        when(criteriaBuilder.notEqual(statusPath, WorkspaceStatus.ARCHIVED)).thenReturn(predicate);
        Specification<Workspace> specification = WorkspaceSpecifications.isNotArchived();

        Predicate result = specification.toPredicate(root, query, criteriaBuilder);

        assertThat(result).isSameAs(predicate);
        verify(criteriaBuilder).notEqual(statusPath, WorkspaceStatus.ARCHIVED);
    }
}
