package com.udistrital.authback.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.udistrital.authback.entity.Admin;

/**
 * Repository interface for Admin entity operations.
 */
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    /**
     * Finds an admin by username.
     *
     * @param username the username to search for
     * @return an Optional containing the admin if found
     */
    Optional<Admin> findByUsername(String username);
}

