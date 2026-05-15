package com.cospace.service.impl;

import com.cospace.dto.request.RechargeRequest;
import com.cospace.dto.response.WalletResponse;
import com.cospace.entity.Wallet;
import com.cospace.entity.WalletTransaction;
import com.cospace.enums.TransactionType;
import com.cospace.exception.BusinessException;
import com.cospace.exception.InsufficientBalanceException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.WalletRepository;
import com.cospace.repository.WalletTransactionRepository;
import com.cospace.service.WalletService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    public WalletServiceImpl(
            WalletRepository walletRepository,
            WalletTransactionRepository walletTransactionRepository
    ) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public WalletResponse getBalance(Long memberId) {
        Wallet wallet = walletRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        return toResponse(wallet);
    }

    @Override
    public WalletResponse recharge(Long memberId, RechargeRequest request) {
        Wallet wallet = walletRepository.findByMemberIdForUpdate(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.recharge(request.amount());
        walletRepository.save(wallet);
        createTransaction(wallet, request.amount(), TransactionType.RECHARGE);

        return toResponse(wallet);
    }

    @Override
    public WalletResponse deductFunds(Long memberId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Payment amount must be greater than zero");
        }

        Wallet wallet = walletRepository.findByMemberIdForUpdate(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Wallet balance is not enough");
        }

        wallet.pay(amount);
        walletRepository.save(wallet);
        createTransaction(wallet, amount, TransactionType.PAYMENT);

        return toResponse(wallet);
    }

    private void createTransaction(Wallet wallet, BigDecimal amount, TransactionType type) {
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(amount);
        transaction.setType(type);
        walletTransactionRepository.save(transaction);
    }

    private WalletResponse toResponse(Wallet wallet) {
        return new WalletResponse(wallet.getId(), wallet.getBalance());
    }
}
