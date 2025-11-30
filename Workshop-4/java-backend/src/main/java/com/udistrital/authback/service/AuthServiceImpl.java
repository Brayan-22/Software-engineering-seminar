package com.udistrital.authback.service;

import com.udistrital.authback.dto.ValidateTokenRequestDTO;
import com.udistrital.authback.dto.ValidateTokenResponseDTO;
import com.udistrital.authback.service.impl.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.udistrital.authback.dto.LoginRequestDTO;
import com.udistrital.authback.repository.AdminRepository;
import com.udistrital.authback.security.JwtUtil;
import com.udistrital.authback.entity.Admin;

/**
 * Implementation of authentication service.
 */
@Service
@RequiredArgsConstructor
public final class AuthServiceImpl implements AuthService {

    /**
     * Repository for admin user operations.
     */
    private final AdminRepository adminRepository;

    /**
     * Password encoder for credential verification.
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * JWT utility for token operations.
     */
    private final JwtUtil jwtUtil;

    @Override
    public String login(final LoginRequestDTO request) {
        Admin admin = adminRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        final boolean passwordMatches = passwordEncoder
                .matches(request.getPassword(),
                        admin.getPasswordHash());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(admin.getUsername());
    }

    @Override
    public ValidateTokenResponseDTO validateToken(
            final ValidateTokenRequestDTO request) {
        var result = jwtUtil.validateToken(request.getAuthToken());
        return ValidateTokenResponseDTO.builder()
                .isValid(result).build();
    }

}

