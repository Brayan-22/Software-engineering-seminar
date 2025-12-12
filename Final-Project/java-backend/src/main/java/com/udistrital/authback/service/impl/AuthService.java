package com.udistrital.authback.service.impl;

import com.udistrital.authback.dto.LoginRequestDTO;
import com.udistrital.authback.dto.ValidateTokenRequestDTO;
import com.udistrital.authback.dto.ValidateTokenResponseDTO;

/**
 * Service interface for authentication operations.
 */
public interface AuthService {
    /**
     * Authenticates a user with provided credentials.
     *
     * @param request login request containing credentials
     * @return JWT token if authentication is successful
     */
    String login(LoginRequestDTO request);

    /**
     * Validates a JWT token.
     *
     * @param request validation request containing the token
     * @return validation response with result
     */
    ValidateTokenResponseDTO validateToken(
            ValidateTokenRequestDTO request);
}

