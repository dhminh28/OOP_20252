package com.cospace.service.impl;

import com.cospace.dto.response.WalletResponse;
import com.cospace.entity.Wallet;
import com.cospace.entity.WalletTransaction;
import com.cospace.enums.TransactionType;
import com.cospace.exception.InsufficientBalanceException;
import com.cospace.repository.WalletRepository;
import com.cospace.repository.WalletTransactionRepository;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WalletServiceImplTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private WalletTransactionRepository walletTransactionRepository;

    private WalletServiceImpl walletService;

    @BeforeEach
    void setUp() {
        walletService = new WalletServiceImpl(walletRepository, walletTransactionRepository);
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

    private Wallet walletWithBalance(String balance) {
        Wallet wallet = new Wallet();
        ReflectionTestUtils.setField(wallet, "id", 7L);
        wallet.recharge(new BigDecimal(balance));
        return wallet;
    }
}
