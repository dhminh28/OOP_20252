package com.cospace.controller;

import com.cospace.config.OpenApiConfig;
import com.cospace.dto.request.BookingCancelRequest;
import com.cospace.dto.request.BookingRequest;
import com.cospace.dto.response.ApiResponse;
import com.cospace.dto.response.BookingResponse;
import com.cospace.security.CurrentUser;
import com.cospace.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
@Tag(name = "Bookings", description = "Authenticated workspace booking APIs with conflict checking and wallet payment.")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(
            summary = "Create a booking",
            description = "Checks workspace availability, calculates price, deducts wallet balance, and saves a successful booking in one transaction.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "Workspace ID, start/end time, and optional note.",
                    content = @Content(schema = @Schema(implementation = BookingRequest.class))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Booking completed. Response body is ApiResponse<BookingResponse>.",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid time range or insufficient wallet balance."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Missing or invalid JWT."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Member or workspace not found."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Workspace is already booked for this time slot.")
    })
    public ApiResponse<BookingResponse> create(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody BookingRequest request
    ) {
        return ApiResponse.ok(bookingService.create(currentUser.id(), request));
    }

    @GetMapping("/my")
    @Operation(
            summary = "List my bookings",
            description = "Returns the authenticated member's booking history."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Paginated booking history. Response body is ApiResponse<Page<BookingResponse>>."
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Missing or invalid JWT.")
    })
    public ApiResponse<Page<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PageableDefault(size = 10, sort = "startTime") Pageable pageable
    ) {
        return ApiResponse.ok(bookingService.getMyBookings(currentUser.id(), pageable));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(
            summary = "Cancel a booking",
            description = "Cancels a booking owned by the authenticated member. Refund behavior will be implemented in a later phase.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = false,
                    description = "Optional cancellation reason. It is stored in the booking note.",
                    content = @Content(schema = @Schema(implementation = BookingCancelRequest.class))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Booking cancelled. Response body is ApiResponse<BookingResponse>.",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Missing or invalid JWT."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking not found.")
    })
    public ApiResponse<BookingResponse> cancel(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long id,
            @Valid @RequestBody(required = false) BookingCancelRequest request
    ) {
        String reason = request == null ? null : request.reason();
        return ApiResponse.ok(bookingService.cancel(currentUser.id(), id, reason));
    }
}
