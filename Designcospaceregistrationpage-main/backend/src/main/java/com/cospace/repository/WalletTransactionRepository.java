package com.cospace.repository;

import com.cospace.dto.response.MonthlyRevenueResponse;
import com.cospace.entity.WalletTransaction;
import com.cospace.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);

    @Query("select sum(walletTransaction.amount) from WalletTransaction walletTransaction where walletTransaction.type = :type")
    BigDecimal sumAmountByType(@Param("type") TransactionType type);

    @Query("""
            select new com.cospace.dto.response.MonthlyRevenueResponse(
                function('to_char', walletTransaction.createdAt, 'YYYY-MM'),
                sum(walletTransaction.amount)
            )
            from WalletTransaction walletTransaction
            where walletTransaction.type = :type
            group by function('to_char', walletTransaction.createdAt, 'YYYY-MM')
            order by function('to_char', walletTransaction.createdAt, 'YYYY-MM')
            """)
    List<MonthlyRevenueResponse> sumAmountByMonthAndType(@Param("type") TransactionType type);
}
