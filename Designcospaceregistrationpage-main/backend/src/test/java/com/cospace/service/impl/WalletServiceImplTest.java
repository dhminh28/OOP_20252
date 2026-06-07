package com.cospace.service.impl;

import com.cospace.dto.response.WalletResponse;
import com.cospace.entity.Member;
import com.cospace.entity.RechargeRequest;
import com.cospace.entity.Wallet;
import com.cospace.entity.WalletTransaction;
import com.cospace.enums.RechargeRequestStatus;
import com.cospace.enums.TransactionType;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ConflictException;
import com.cospace.exception.InsufficientBalanceException;
import com.cospace.repository.MemberRepository;
import com.cospace.repository.RechargeRequestRepository;
import com.cospace.repository.WalletRepository;
import com.cospace.repository.WalletTransactionRepository;
import com.cospace.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WalletServiceImplTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private WalletTransactionRepository walletTransactionRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private RechargeRequestRepository rechargeRequestRepository;

    @Mock
    private NotificationService notificationService;

    private WalletServiceImpl walletService;

    @BeforeEach
    void setUp() {
        walletService = new WalletServiceImpl(
                walletRepository,
                walletTransactionRepository,
                memberRepository,
                rechargeRequestRepository,
                notificationService
        );
    }

    @Test
    void deductFunds_whenBalanceIsEnough_deductsBalanceAndCreatesPaymentTransaction() {
        Wallet wallet = walletWithBalance("500000");
        when(walletRepository.findByMemberIdForUpdate(1L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(wallet)).thenReturn(wallet);

        WalletResponse response = walletService.deductFunds(1L, new BigDecimal("150000"));

        assertThat(response.balance()).isEqualByComparingTo("350000");
        assertThat(wallet.getBalance()).isEqualByComparingTo("350000");
        verify(walletRepository).save(wallet);

        ArgumentCaptor<WalletTransaction> transactionCaptor = ArgumentCaptor.forClass(WalletTransaction.class);
        verify(walletTransactionRepository).save(transactionCaptor.capture());
        WalletTransaction transaction = transactionCaptor.getValue();
        assertThat(transaction.getWallet()).isSameAs(wallet);
        assertThat(transaction.getAmount()).isEqualByComparingTo("150000");
        assertThat(transaction.getType()).isEqualTo(TransactionType.PAYMENT);
    }

    @Test
    void deductFunds_whenBalanceIsInsufficient_throwsExceptionAndDoesNotPersistChanges() {
        Wallet wallet = walletWithBalance("100000");
        when(walletRepository.findByMemberIdForUpdate(1L)).thenReturn(Optional.of(wallet));

        assertThatThrownBy(() -> walletService.deductFunds(1L, new BigDecimal("150000")))
                .isInstanceOf(InsufficientBalanceException.class)
                .hasMessage("Wallet balance is not enough");

        assertThat(wallet.getBalance()).isEqualByComparingTo("100000");
        verify(walletRepository, never()).save(any());
        verify(walletTransactionRepository, never()).save(any());
    }

    @Test
    void refundFunds_addsBalanceAndCreatesRefundTransaction() {
        Wallet wallet = walletWithBalance("350000");
        when(walletRepository.findByMemberIdForUpdate(1L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(wallet)).thenReturn(wallet);

        WalletResponse response = walletService.refundFunds(1L, new BigDecimal("150000"));

        assertThat(response.balance()).isEqualByComparingTo("500000");
        assertThat(wallet.getBalance()).isEqualByComparingTo("500000");
        verify(walletRepository).save(wallet);

        ArgumentCaptor<WalletTransaction> transactionCaptor = ArgumentCaptor.forClass(WalletTransaction.class);
        verify(walletTransactionRepository).save(transactionCaptor.capture());
        WalletTransaction transaction = transactionCaptor.getValue();
        assertThat(transaction.getWallet()).isSameAs(wallet);
        assertThat(transaction.getAmount()).isEqualByComparingTo("150000");
        assertThat(transaction.getType()).isEqualTo(TransactionType.REFUND);
    }

    @Test
    void refundFunds_whenAmountIsInvalid_doesNotAccessWallet() {
        assertThatThrownBy(() -> walletService.refundFunds(1L, BigDecimal.ZERO))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Refund amount must be greater than zero");

        verify(walletRepository, never()).findByMemberIdForUpdate(any());
        verify(walletRepository, never()).save(any());
        verify(walletTransactionRepository, never()).save(any());
    }

    @Test
    void approveRecharge_whenPending_addsBalanceAndCreatesTransactionAndNotification() {
        Member member = member(1L);
        RechargeRequest request = rechargeRequest(11L, member, "500000");
        Wallet wallet = walletWithBalance("100000");

        when(rechargeRequestRepository.findByIdForUpdate(11L))
                .thenReturn(Optional.of(request));
        when(walletRepository.findByMemberIdForUpdate(1L))
                .thenReturn(Optional.of(wallet));
        when(walletRepository.save(wallet)).thenReturn(wallet);
        when(rechargeRequestRepository.save(request)).thenReturn(request);

        var response = walletService.approveRecharge(11L);

        assertThat(response.status()).isEqualTo(RechargeRequestStatus.APPROVED);
        assertThat(wallet.getBalance()).isEqualByComparingTo("600000");
        verify(walletRepository).save(wallet);
        verify(rechargeRequestRepository).save(request);
        verify(notificationService).sendNotification(
                eq(1L),
                any(String.class),
                any(String.class)
        );

        ArgumentCaptor<WalletTransaction> transactionCaptor =
                ArgumentCaptor.forClass(WalletTransaction.class);
        verify(walletTransactionRepository).save(transactionCaptor.capture());
        assertThat(transactionCaptor.getValue().getType())
                .isEqualTo(TransactionType.RECHARGE);
        assertThat(transactionCaptor.getValue().getAmount())
                .isEqualByComparingTo("500000");
    }

    @Test
    void approveRecharge_whenAlreadyProcessed_throwsConflictWithoutChangingWallet() {
        RechargeRequest request = rechargeRequest(11L, member(1L), "500000");
        request.approve();
        when(rechargeRequestRepository.findByIdForUpdate(11L))
                .thenReturn(Optional.of(request));

        assertThatThrownBy(() -> walletService.approveRecharge(11L))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Recharge request has already been processed");

        verify(walletRepository, never()).findByMemberIdForUpdate(any());
        verify(walletRepository, never()).save(any());
        verify(walletTransactionRepository, never()).save(any());
        verify(notificationService, never()).sendNotification(any(), any(), any());
    }

    private Wallet walletWithBalance(String balance) {
        Wallet wallet = new Wallet();
        ReflectionTestUtils.setField(wallet, "id", 7L);
        wallet.recharge(new BigDecimal(balance));
        return wallet;
    }

    private Member member(Long id) {
        Member member = new Member();
        ReflectionTestUtils.setField(member, "id", id);
        member.setFullName("Demo Member");
        member.setEmail("member@cospace.vn");
        return member;
    }

    private RechargeRequest rechargeRequest(
            Long id,
            Member member,
            String amount
    ) {
        RechargeRequest request = new RechargeRequest();
        ReflectionTestUtils.setField(request, "id", id);
        request.setMember(member);
        request.setAmount(new BigDecimal(amount));
        return request;
    }
}
