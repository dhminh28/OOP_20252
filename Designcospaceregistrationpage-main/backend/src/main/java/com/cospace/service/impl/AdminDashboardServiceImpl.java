package com.cospace.service.impl;

import com.cospace.dto.response.BookingStatusSummaryResponse;
import com.cospace.dto.response.DashboardSummaryResponse;
import com.cospace.dto.response.MonthlyRevenueResponse;
import com.cospace.enums.BookingStatus;
import com.cospace.enums.TransactionType;
import com.cospace.repository.BookingRepository;
import com.cospace.repository.UserRepository;
import com.cospace.repository.WalletTransactionRepository;
import com.cospace.repository.WorkspaceRepository;
import com.cospace.service.AdminDashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final WalletTransactionRepository walletTransactionRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;

    public AdminDashboardServiceImpl(
            WalletTransactionRepository walletTransactionRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            WorkspaceRepository workspaceRepository
    ) {
        this.walletTransactionRepository = walletTransactionRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        BigDecimal revenue = walletTransactionRepository.sumAmountByType(TransactionType.PAYMENT);
        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }
        long successfulBookings = bookingRepository.countByStatus(BookingStatus.SUCCESS);
        long registeredUsers = userRepository.count();
        double occupancyRate = calculateOccupancyRate(successfulBookings, workspaceRepository.count());
        List<MonthlyRevenueResponse> monthlyRevenue = lastSixMonths(
                walletTransactionRepository.sumAmountByMonthAndType(TransactionType.PAYMENT)
        );
        List<BookingStatusSummaryResponse> bookingStatusSummary = bookingRepository.countGroupByStatus();

        return new DashboardSummaryResponse(
                revenue,
                successfulBookings,
                registeredUsers,
                occupancyRate,
                monthlyRevenue,
                bookingStatusSummary
        );
    }

    private double calculateOccupancyRate(long successfulBookings, long totalWorkspaces) {
        if (totalWorkspaces == 0) {
            return 0;
        }
        BigDecimal rate = BigDecimal.valueOf(successfulBookings)
                .divide(BigDecimal.valueOf(totalWorkspaces), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        return rate.doubleValue();
    }

    private List<MonthlyRevenueResponse> lastSixMonths(List<MonthlyRevenueResponse> monthlyRevenue) {
        int fromIndex = Math.max(monthlyRevenue.size() - 6, 0);
        return monthlyRevenue.subList(fromIndex, monthlyRevenue.size());
    }
}
