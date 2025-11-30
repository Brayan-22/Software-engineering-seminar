package com.udistrital.authback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for token validation requests.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ValidateTokenRequestDTO {
    /**
     * The authentication token to validate.
     */
    private String authToken;
}

