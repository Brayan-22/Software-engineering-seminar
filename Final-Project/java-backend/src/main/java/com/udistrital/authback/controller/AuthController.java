package com.udistrital.authback.controller;

import com.udistrital.authback.dto.ValidateTokenRequestDTO;
import com.udistrital.authback.dto.ValidateTokenResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.udistrital.authback.dto.LoginRequestDTO;
import com.udistrital.authback.dto.LoginResponseDTO;
import com.udistrital.authback.service.impl.AuthService;

import lombok.RequiredArgsConstructor;

/**
 * REST controller for authentication endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public final class AuthController {

    /**
     * Authentication service.
     */
    private final AuthService authService;

    /**
     * Handles user login requests.
     *
     * @param request the login request with credentials
     * @return response entity with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody final LoginRequestDTO request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    /**
     * Validates a JWT token.
     *
     * @param request the validation request with token
     * @return response entity with validation result
     */
    @PostMapping("/validate")
    public ResponseEntity<ValidateTokenResponseDTO> validateToken(
            @RequestBody final ValidateTokenRequestDTO request) {
        return ResponseEntity.ok()
                .body(authService.validateToken(request));
    }
}

