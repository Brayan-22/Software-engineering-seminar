package com.udistrital.authback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for token validation responses.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidateTokenResponseDTO {
    /**
     * Indicates whether the token is valid.
     */
    private Boolean isValid;
}

