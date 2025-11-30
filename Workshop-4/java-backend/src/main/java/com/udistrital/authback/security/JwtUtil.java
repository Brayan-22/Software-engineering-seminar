package com.udistrital.authback.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Date;
import java.util.function.Function;

/**
 * Utility class for JWT token operations.
 */
@Component
@RequiredArgsConstructor
@Lazy
@Slf4j
public final class JwtUtil {

    /**
     * Key pair for JWT signing and verification.
     */
    private final KeyPair keyPair;

    /**
     * Private key for signing tokens.
     */
    private PrivateKey privateKey;

    /**
     * Public key for verifying tokens.
     */
    private PublicKey publicKey;

    /**
     * Token expiration time in milliseconds (30 minutes).
     */
    private static final Long EXPIRATION_TIME = 30L * 60L * 1000L;

    /**
     * Initializes the private and public keys from the key pair.
     */
    @PostConstruct
    public void setup() {
        this.privateKey = keyPair.getPrivate();
        this.publicKey = keyPair.getPublic();
    }

    /**
     * Generates a JWT token for a user.
     *
     * @param username the username to include in the token
     * @return the generated JWT token
     */
    public String generateToken(final String username) {
        final long currentTime = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(currentTime
                        + EXPIRATION_TIME))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    /**
     * Validates a JWT token.
     *
     * @param token the token to validate
     * @return true if the token is valid, false otherwise
     */
    public boolean validateToken(final String token) {
        try {
            String username = extractUsername(token);
            Date expiration = extractExpiration(token);
            return (username != null && expiration.after(new Date()));
        } catch (ExpiredJwtException e) {
            log.warn("Token expirado: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.warn("Token inválido: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extracts a specific claim from the token.
     *
     * @param token the JWT token
     * @param claimsResolver function to extract the claim
     * @param <T> the type of the claim
     * @return the extracted claim
     */
    public <T> T extractClaim(final String token,
            final Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts the username from the token.
     *
     * @param token the JWT token
     * @return the username
     */
    public String extractUsername(final String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from the token.
     *
     * @param token the JWT token
     * @return the expiration date
     */
    public Date extractExpiration(final String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts all claims from the token.
     *
     * @param token the JWT token
     * @return the claims
     */
    private Claims extractAllClaims(final String token) {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

