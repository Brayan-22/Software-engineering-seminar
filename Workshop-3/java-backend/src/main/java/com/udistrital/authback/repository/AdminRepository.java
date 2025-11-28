package com.udistrital.authback.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.udistrital.authback.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByUsername(String username);
}