package com.udistrital.authback.service;

import com.udistrital.authback.dto.LoginRequest;
import com.udistrital.authback.entity.Admin;
import com.udistrital.authback.repository.AdminRepository;
import com.udistrital.authback.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private AuthService authService;
    private AdminRepository adminRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        adminRepository = Mockito.mock(AdminRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        jwtUtil = Mockito.mock(JwtUtil.class);

        authService = new AuthService(adminRepository, passwordEncoder, jwtUtil);
    }

    @Test
    void testLoginSuccess() {
        // Arrange
        Admin admin = new Admin("admin", "hashed", "admin@mail.com");
        when(adminRepository.findByUsername("admin")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("1234", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken("admin")).thenReturn("fake.jwt.token");

        // Act
        String token = authService.login(new LoginRequest("admin", "1234"));

        // Assert
        assertEquals("fake.jwt.token", token);
    }

    @Test
    void testInvalidPassword() {
        Admin admin = new Admin("admin", "hashed", "admin@mail.com");
        when(adminRepository.findByUsername("admin")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(RuntimeException.class,
                () -> authService.login(new LoginRequest("admin", "wrong")));
    }

    @Test
    void testUserNotFound() {
        when(adminRepository.findByUsername("missing")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> authService.login(new LoginRequest("missing", "1234")));
    }
}