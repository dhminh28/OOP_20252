package com.cospace.service;

import com.cospace.dto.request.RechargeRequest;
import com.cospace.dto.response.WalletResponse;

import java.math.BigDecimal;

public interface WalletService {
    WalletResponse getBalance(Long memberId);

    WalletResponse recharge(Long memberId, RechargeRequest request);

    WalletResponse deductFunds(Long memberId, BigDecimal amount);
}
