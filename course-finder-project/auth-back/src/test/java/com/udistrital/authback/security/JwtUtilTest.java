package com.udistrital.authback.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link JwtUtil}.
 *
 * This test verifies that the JWT token generated:
 *  - is not null
 *  - contains the expected username as subject
 *  - has a valid expiration date
 *
 * Uses a temporary RSA key pair instead of the real private key.
 */
class JwtUtilTest {

    private JwtUtil jwtUtil;
    private KeyPair keyPair;

    @BeforeEach
    void setUp() throws Exception {
        // Generate a temporary RSA key pair for testing
        keyPair = KeyPairGenerator.getInstance("RSA").generateKeyPair();

        jwtUtil = new JwtUtil();
        // Manually inject the private key (simulating @Autowired)
        jwtUtil.privateKey = keyPair.getPrivate();
    }

    @Test
    void generateToken_ShouldReturnValidJwt() {
        // Arrange
        String username = "testUser";

        // Act
        String token = jwtUtil.generateToken(username);

        // Assert
        assertNotNull(token, "Token should not be null");

        // Decode and verify claims using the public key
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(keyPair.getPublic())
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertEquals(username, claims.getSubject(), "Username should match");
        assertTrue(claims.getExpiration().after(new Date()), "Expiration should be in the future");
    }
}