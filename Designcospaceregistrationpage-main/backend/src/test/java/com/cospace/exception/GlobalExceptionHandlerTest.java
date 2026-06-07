package com.cospace.exception;

import com.cospace.dto.response.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.lang.reflect.Method;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Test
    void handleValidation_returnsErrorsGroupedByField() throws NoSuchMethodException {
        BeanPropertyBindingResult bindingResult =
                new BeanPropertyBindingResult(new Object(), "request");
        bindingResult.addError(new FieldError(
                "request",
                "email",
                "must be a well-formed email address"
        ));
        bindingResult.addError(new FieldError(
                "request",
                "fullName",
                "must not be blank"
        ));
        Method method = ValidationMethod.class.getDeclaredMethod("validate", Object.class);
        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(
                new MethodParameter(method, 0),
                bindingResult
        );

        ResponseEntity<ApiResponse<Map<String, String>>> response =
                exceptionHandler.handleValidation(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().message()).isEqualTo("Validation failed");
        assertThat(response.getBody().data()).containsExactlyInAnyOrderEntriesOf(Map.of(
                "email", "must be a well-formed email address",
                "fullName", "must not be blank"
        ));
    }

    private static final class ValidationMethod {
        @SuppressWarnings("unused")
        private void validate(Object request) {
        }
    }
}
