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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminDashboardServiceImplTest {

    @Mock
    private WalletTransactionRepository walletTransactionRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkspaceRepository workspaceRepository;

    private AdminDashboardServiceImpl adminDashboardService;

    @BeforeEach
    void setUp() {
        adminDashboardService = new AdminDashboardServiceImpl(
                walletTransactionRepository,
                bookingRepository,
                userRepository,
                workspaceRepository
        );
    }

    @Test
    void getSummary_aggregatesMetricsFromRepositories() {
        List<MonthlyRevenueResponse> monthlyRevenue = List.of(
                new MonthlyRevenueResponse("2026-01", new BigDecimal("100000")),
                new MonthlyRevenueResponse("2026-02", new BigDecimal("200000")),
                new MonthlyRevenueResponse("2026-03", new BigDecimal("300000")),
                new MonthlyRevenueResponse("2026-04", new BigDecimal("400000")),
                new MonthlyRevenueResponse("2026-05", new BigDecimal("500000")),
                new MonthlyRevenueResponse("2026-06", new BigDecimal("600000")),
                new MonthlyRevenueResponse("2026-07", new BigDecimal("700000"))
        );
        List<BookingStatusSummaryResponse> bookingStatusSummary = List.of(
                new BookingStatusSummaryResponse(BookingStatus.SUCCESS, 3),
                new BookingStatusSummaryResponse(BookingStatus.CANCELLED, 1)
        );

        when(walletTransactionRepository.sumAmountByType(TransactionType.PAYMENT))
                .thenReturn(new BigDecimal("2800000"));
        when(bookingRepository.countByStatus(BookingStatus.SUCCESS)).thenReturn(3L);
        when(userRepository.count()).thenReturn(7L);
        when(workspaceRepository.count()).thenReturn(5L);
        when(walletTransactionRepository.sumAmountByMonthAndType(TransactionType.PAYMENT))
                .thenReturn(monthlyRevenue);
        when(bookingRepository.countGroupByStatus()).thenReturn(bookingStatusSummary);

        DashboardSummaryResponse response = adminDashboardService.getSummary();

        assertThat(response.revenue()).isEqualByComparingTo("2800000");
        assertThat(response.totalBookings()).isEqualTo(3);
        assertThat(response.activeMembers()).isEqualTo(7);
        assertThat(response.occupancyRate()).isEqualTo(60.0);
        assertThat(response.monthlyRevenue()).hasSize(6);
        assertThat(response.monthlyRevenue().get(0).period()).isEqualTo("2026-02");
        assertThat(response.bookingStatusSummary()).isEqualTo(bookingStatusSummary);
    }

    @Test
    void getSummary_whenNoPaymentTransactions_returnsZeroRevenue() {
        when(walletTransactionRepository.sumAmountByType(TransactionType.PAYMENT)).thenReturn(null);
        when(bookingRepository.countByStatus(BookingStatus.SUCCESS)).thenReturn(0L);
        when(userRepository.count()).thenReturn(1L);
        when(workspaceRepository.count()).thenReturn(0L);
        when(walletTransactionRepository.sumAmountByMonthAndType(TransactionType.PAYMENT)).thenReturn(List.of());
        when(bookingRepository.countGroupByStatus()).thenReturn(List.of());

        DashboardSummaryResponse response = adminDashboardService.getSummary();

        assertThat(response.revenue()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.occupancyRate()).isZero();
        assertThat(response.monthlyRevenue()).isEmpty();
    }
}
