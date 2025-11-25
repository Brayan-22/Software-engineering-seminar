package com.udistrital.authback.service;

import com.udistrital.authback.dto.LoginRequestDTO;
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



/**
 * Unit tests for {@link AuthServiceImpl}.
 *
 * These tests verify the authentication logic responsible for validating
 * admin credentials and generating JWT tokens.
 *
 * Test coverage includes:
 *  - Successful login when valid credentials are provided.
 *  - Failed login when the password is incorrect.
 *  - Failed login when the user does not exist.
 *
 * Mocks are used for:
 *  - {@link AdminRepository} to simulate database queries.
 *  - {@link PasswordEncoder} to verify password matching.
 *  - {@link JwtUtil} to simulate token generation without requiring real signing.
 *
 * This ensures the authentication logic is correctly validated
 * in isolation, without connecting to an actual database or security layer.
 */
class AuthServiceTest {

    private AuthServiceImpl authService;
    private AdminRepository adminRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        adminRepository = Mockito.mock(AdminRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        jwtUtil = Mockito.mock(JwtUtil.class);

        authService = new AuthServiceImpl(adminRepository, passwordEncoder, jwtUtil);
    }

    @Test
    void testLoginSuccess() {
        // Arrange
        Admin admin = new Admin("admin", "hashed", "admin@mail.com");
        when(adminRepository.findByUsername("admin")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("1234", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken("admin")).thenReturn("fake.jwt.token");

        // Act
        String token = authService.login(new LoginRequestDTO("admin", "1234"));

        // Assert
        assertEquals("fake.jwt.token", token);
    }

    @Test
    void testInvalidPassword() {
        Admin admin = new Admin("admin", "hashed", "admin@mail.com");
        when(adminRepository.findByUsername("admin")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(RuntimeException.class,
                () -> authService.login(new LoginRequestDTO("admin", "wrong")));
    }

    @Test
    void testUserNotFound() {
        when(adminRepository.findByUsername("missing")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> authService.login(new LoginRequestDTO("missing", "1234")));
    }
}