package com.udistrital.authback.controller;

import com.udistrital.authback.dto.ValidateTokenRequestDTO;
import com.udistrital.authback.dto.ValidateTokenResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.udistrital.authback.dto.LoginRequestDTO;
import com.udistrital.authback.dto.LoginResponseDTO;
import com.udistrital.authback.service.AuthServiceImpl;
import com.udistrital.authback.service.impl.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidateTokenResponseDTO> validateToken(@RequestBody ValidateTokenRequestDTO request) {
        return ResponseEntity.ok().body(authService.validateToken(request));
    }
}
