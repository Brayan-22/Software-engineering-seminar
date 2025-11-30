package com.udistrital.authback.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.
        AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.io.IOException;
import java.nio.charset.Charset;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

/**
 * Security configuration for the application.
 */
@Configuration
public final class SecurityConfig {

    /**
     * Private constructor to prevent instantiation.
     */
    private SecurityConfig() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Creates a key pair from PEM files.
     *
     * @return the RSA key pair
     * @throws InvalidKeySpecException if key spec is invalid
     * @throws IOException if file cannot be read
     * @throws NoSuchAlgorithmException if RSA is not available
     */
    @Bean
    public static KeyPair keyPair()
            throws InvalidKeySpecException, IOException,
                   NoSuchAlgorithmException {
        Resource privateKeyResource =
                new ClassPathResource("keys/private-key.pem");
        Resource publicKeyResource =
                new ClassPathResource("keys/public-key.pem");
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        if (privateKeyResource.exists()
                && publicKeyResource.exists()) {
            // Lectura de la clave privada desde el archivo PEM
            String privateKeyPem = privateKeyResource
                    .getContentAsString(Charset.defaultCharset())
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replaceAll(System.lineSeparator(), "")
                    .replace("-----END PRIVATE KEY-----", "");
            byte[] privateKeyBytes =
                    Base64.getDecoder().decode(privateKeyPem);
            PKCS8EncodedKeySpec privateKeySpec =
                    new PKCS8EncodedKeySpec(privateKeyBytes);
            // Lectura de la clave pública desde el archivo PEM
            String publicKeyPem = publicKeyResource
                    .getContentAsString(Charset.defaultCharset())
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replaceAll(System.lineSeparator(), "")
                    .replace("-----END PUBLIC KEY-----", "");
            byte[] publicKeyBytes =
                    Base64.getDecoder().decode(publicKeyPem);
            X509EncodedKeySpec publicKeySpec =
                    new X509EncodedKeySpec(publicKeyBytes);
            // Generación de las claves
            PrivateKey privateKey =
                    keyFactory.generatePrivate(privateKeySpec);
            PublicKey publicKey =
                    keyFactory.generatePublic(publicKeySpec);
            return new KeyPair(publicKey, privateKey);
        }
        return null;
    }

    /**
     * Configures the security filter chain.
     *
     * @param http the HttpSecurity object
     * @return the SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public static SecurityFilterChain configure(
            final HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(AbstractHttpConfigurer::disable);
        return http.build();
    }

    /**
     * Creates a BCrypt password encoder bean.
     *
     * @return the password encoder
     */
    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

