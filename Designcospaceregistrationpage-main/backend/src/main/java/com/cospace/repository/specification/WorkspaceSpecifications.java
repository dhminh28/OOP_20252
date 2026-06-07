package com.cospace.repository.specification;

import com.cospace.entity.Workspace;
import com.cospace.enums.WorkspaceStatus;
import com.cospace.enums.WorkspaceType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class WorkspaceSpecifications {

    private WorkspaceSpecifications() {
    }

    public static Specification<Workspace> hasType(WorkspaceType type) {
        return (root, query, criteriaBuilder) -> type == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("type"), type);
    }

    public static Specification<Workspace> hasMinimumCapacity(Integer minCapacity) {
        return (root, query, criteriaBuilder) -> minCapacity == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.greaterThanOrEqualTo(root.get("capacity"), minCapacity);
    }

    public static Specification<Workspace> hasMaximumPrice(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> maxPrice == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.lessThanOrEqualTo(root.get("pricePerHour"), maxPrice);
    }

    public static Specification<Workspace> isNotArchived() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(root.get("status"), WorkspaceStatus.ARCHIVED);
    }

    public static Specification<Workspace> withFilters(
            WorkspaceType type,
            Integer minCapacity,
            BigDecimal maxPrice
    ) {
        return hasType(type)
                .and(hasMinimumCapacity(minCapacity))
                .and(hasMaximumPrice(maxPrice))
                .and(isNotArchived());
    }
}
