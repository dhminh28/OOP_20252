package com.cospace.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class RegisterRequestValidationTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidatorFactory() {
        validatorFactory.close();
    }

    @Test
    void passwordShorterThanEightCharacters_isRejected() {
        RegisterRequest request = new RegisterRequest(
                "Nguyen Van A",
                "member@cospace.vn",
                "1234567",
                null
        );

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations)
                .anySatisfy(violation -> {
                    assertThat(violation.getPropertyPath().toString()).isEqualTo("password");
                    assertThat(violation.getMessage())
                            .isEqualTo("Mật khẩu phải dài tối thiểu 8 ký tự");
                });
    }

    @Test
    void passwordWithEightCharacters_isAccepted() {
        RegisterRequest request = new RegisterRequest(
                "Nguyen Van A",
                "member@cospace.vn",
                "12345678",
                null
        );

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }
}
