package com.udistrital.authback;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.udistrital.authback.entity.Admin;
import com.udistrital.authback.repository.AdminRepository;

@SpringBootApplication
public class AuthBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthBackApplication.class, args);
    }

    @Bean
    public ApplicationRunner runner(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.count() == 0){
                Admin administrador = new Admin();
                administrador.setUsername("admin");
                administrador.setPasswordHash(passwordEncoder.encode("admin123"));
                administrador.setEmail("admin@correo.com");
                adminRepository.save(administrador);
            }
        };
    }

}
