package com.udistrital.authback.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret-key}")
    private String jwtSecretBase64;

    private Key jwtSecretKey;
    
    @PostConstruct
    public void init(){
        jwtSecretKey = io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecretBase64.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .signWith(jwtSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}