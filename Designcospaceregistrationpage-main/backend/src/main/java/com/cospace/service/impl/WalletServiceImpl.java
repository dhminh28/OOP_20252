package com.cospace.service.impl;

import com.cospace.dto.request.RechargeRequest;
import com.cospace.dto.response.RechargeRequestResponse;
import com.cospace.dto.response.WalletResponse;
import com.cospace.entity.Member;
import com.cospace.entity.Wallet;
import com.cospace.entity.WalletTransaction;
import com.cospace.enums.RechargeRequestStatus;
import com.cospace.enums.TransactionType;
import com.cospace.exception.BusinessException;
import com.cospace.exception.ConflictException;
import com.cospace.exception.InsufficientBalanceException;
import com.cospace.exception.ResourceNotFoundException;
import com.cospace.repository.MemberRepository;
import com.cospace.repository.RechargeRequestRepository;
import com.cospace.repository.WalletRepository;
import com.cospace.repository.WalletTransactionRepository;
import com.cospace.service.NotificationService;
import com.cospace.service.WalletService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final MemberRepository memberRepository;
    private final RechargeRequestRepository rechargeRequestRepository;
    private final NotificationService notificationService;

    public WalletServiceImpl(
            WalletRepository walletRepository,
            WalletTransactionRepository walletTransactionRepository,
            MemberRepository memberRepository,
            RechargeRequestRepository rechargeRequestRepository,
            NotificationService notificationService
    ) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.memberRepository = memberRepository;
        this.rechargeRequestRepository = rechargeRequestRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional(readOnly = true)
    public WalletResponse getBalance(Long memberId) {
        Wallet wallet = walletRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        return toResponse(wallet);
    }

    @Override
    public RechargeRequestResponse createRechargeRequest(Long memberId, RechargeRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        com.cospace.entity.RechargeRequest rechargeRequest =
                new com.cospace.entity.RechargeRequest();
        rechargeRequest.setMember(member);
        rechargeRequest.setAmount(request.amount());

        return toRechargeResponse(rechargeRequestRepository.save(rechargeRequest));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RechargeRequestResponse> getMyRechargeRequests(
            Long memberId,
            Pageable pageable
    ) {
        return rechargeRequestRepository.findByMemberId(memberId, pageable)
                .map(this::toRechargeResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RechargeRequestResponse> getRechargeRequests(
            RechargeRequestStatus status,
            Pageable pageable
    ) {
        if (status == null) {
            return rechargeRequestRepository.findAll(pageable)
                    .map(this::toRechargeResponse);
        }
        return rechargeRequestRepository.findByStatus(status, pageable)
                .map(this::toRechargeResponse);
    }

    @Override
    public RechargeRequestResponse approveRecharge(Long requestId) {
        com.cospace.entity.RechargeRequest request = findPendingRequestForUpdate(requestId);
        Long memberId = request.getMember().getId();
        Wallet wallet = walletRepository.findByMemberIdForUpdate(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.recharge(request.getAmount());
        walletRepository.save(wallet);
        createTransaction(wallet, request.getAmount(), TransactionType.RECHARGE);

        request.approve();
        com.cospace.entity.RechargeRequest savedRequest =
                rechargeRequestRepository.save(request);
        notificationService.sendNotification(
                memberId,
                "Yêu cầu nạp tiền đã được duyệt",
                "Yêu cầu nạp tiền " + formatAmount(request.getAmount())
                        + " VND của bạn đã được duyệt thành công."
        );
        return toRechargeResponse(savedRequest);
    }

    @Override
    public RechargeRequestResponse rejectRecharge(Long requestId, String reason) {
        com.cospace.entity.RechargeRequest request = findPendingRequestForUpdate(requestId);
        request.reject(reason.trim());
        com.cospace.entity.RechargeRequest savedRequest =
                rechargeRequestRepository.save(request);

        notificationService.sendNotification(
                request.getMember().getId(),
                "Yêu cầu nạp tiền đã bị từ chối",
                "Yêu cầu nạp tiền " + formatAmount(request.getAmount())
                        + " VND của bạn đã bị từ chối. Lý do: " + reason.trim()
        );
        return toRechargeResponse(savedRequest);
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

    @Override
    public WalletResponse refundFunds(Long memberId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Refund amount must be greater than zero");
        }

        Wallet wallet = walletRepository.findByMemberIdForUpdate(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.recharge(amount);
        walletRepository.save(wallet);
        createTransaction(wallet, amount, TransactionType.REFUND);

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

    private com.cospace.entity.RechargeRequest findPendingRequestForUpdate(Long requestId) {
        com.cospace.entity.RechargeRequest request =
                rechargeRequestRepository.findByIdForUpdate(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Recharge request not found"));
        if (request.getStatus() != RechargeRequestStatus.PENDING) {
            throw new ConflictException("Recharge request has already been processed");
        }
        return request;
    }

    private RechargeRequestResponse toRechargeResponse(
            com.cospace.entity.RechargeRequest request
    ) {
        Member member = request.getMember();
        return new RechargeRequestResponse(
                request.getId(),
                member.getId(),
                member.getFullName(),
                member.getEmail(),
                request.getAmount(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getUpdatedAt(),
                request.getNote()
        );
    }

    private String formatAmount(BigDecimal amount) {
        return amount.stripTrailingZeros().toPlainString();
    }
}
