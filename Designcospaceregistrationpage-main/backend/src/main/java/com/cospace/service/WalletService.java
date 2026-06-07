package com.cospace.service;

import com.cospace.dto.request.RechargeRequest;
import com.cospace.dto.response.RechargeRequestResponse;
import com.cospace.dto.response.WalletResponse;
import com.cospace.enums.RechargeRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface WalletService {
    WalletResponse getBalance(Long memberId);

    RechargeRequestResponse createRechargeRequest(Long memberId, RechargeRequest request);

    Page<RechargeRequestResponse> getMyRechargeRequests(Long memberId, Pageable pageable);

    Page<RechargeRequestResponse> getRechargeRequests(
            RechargeRequestStatus status,
            Pageable pageable
    );

    RechargeRequestResponse approveRecharge(Long requestId);

    RechargeRequestResponse rejectRecharge(Long requestId, String reason);

    WalletResponse deductFunds(Long memberId, BigDecimal amount);

    WalletResponse refundFunds(Long memberId, BigDecimal amount);
}
