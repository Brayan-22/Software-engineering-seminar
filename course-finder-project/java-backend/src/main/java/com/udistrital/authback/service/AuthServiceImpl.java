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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String login(LoginRequestDTO request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(admin.getUsername());
    }

    @Override
    public ValidateTokenResponseDTO validateToken(ValidateTokenRequestDTO request) {
        var result = jwtUtil.validateToken(request.getAuthToken());
        return ValidateTokenResponseDTO.builder()
                .isValid(result).build();
    }


}