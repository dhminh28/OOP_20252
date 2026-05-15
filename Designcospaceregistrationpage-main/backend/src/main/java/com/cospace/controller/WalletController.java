package com.cospace.controller;

import com.cospace.config.OpenApiConfig;
import com.cospace.dto.request.RechargeRequest;
import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.WalletResponse;
import com.cospace.security.CurrentUser;
import com.cospace.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/wallet")
@Tag(name = "Wallet", description = "Authenticated member wallet balance and recharge APIs.")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    @Operation(
            summary = "Get wallet balance",
            description = "Returns the authenticated member's current wallet balance."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Wallet balance. Response body is ApiResponse<WalletResponse>.",
                    content = @Content(schema = @Schema(implementation = WalletResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Missing or invalid JWT."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Wallet not found.")
    })
    public ApiResponse<WalletResponse> getBalance(@AuthenticationPrincipal CurrentUser currentUser) {
        return ApiResponse.ok(walletService.getBalance(currentUser.id()));
    }

    @PostMapping("/recharge")
    @Operation(
            summary = "Recharge wallet",
            description = "Adds funds to the authenticated member's wallet and records a recharge transaction.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "Positive recharge amount.",
                    content = @Content(schema = @Schema(implementation = RechargeRequest.class))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Recharge completed. Response body is ApiResponse<WalletResponse>.",
                    content = @Content(schema = @Schema(implementation = WalletResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid amount."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Missing or invalid JWT."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Wallet not found.")
    })
    public ApiResponse<WalletResponse> recharge(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody RechargeRequest request
    ) {
        return ApiResponse.ok(walletService.recharge(currentUser.id(), request));
    }
}
