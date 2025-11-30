package com.udistrital.authback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Data Transfer Object for login responses.
 */
@Getter
@AllArgsConstructor
public class LoginResponseDTO {
    /**
     * The JWT authentication token.
     */
    private String token;
}

