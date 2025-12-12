package com.udistrital.authback;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.udistrital.authback.entity.Admin;
import com.udistrital.authback.repository.AdminRepository;

/**
 * Main Spring Boot application class for the authentication backend.
 */
@SpringBootApplication
public final class AuthBackApplication {

    /**
     * Private constructor to prevent instantiation.
     */
    private AuthBackApplication() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Application entry point.
     *
     * @param args command line arguments
     */
    public static void main(final String[] args) {
        SpringApplication.run(AuthBackApplication.class, args);
    }

    /**
     * Application runner bean to initialize default admin user.
     *
     * @param adminRepository repository for admin entities
     * @param passwordEncoder password encoder for hashing
     * @return ApplicationRunner instance
     */
    @Bean
    public static ApplicationRunner runner(
            final AdminRepository adminRepository,
            final PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.count() == 0) {
                Admin administrador = new Admin();
                administrador.setUsername("admin");
                final String encodedPassword =
                        passwordEncoder.encode("admin123");
                administrador.setPasswordHash(encodedPassword);
                administrador.setEmail("admin@correo.com");
                adminRepository.save(administrador);
            }
        };
    }

}

