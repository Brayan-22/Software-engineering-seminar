package com.udistrital.authback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing an administrator user.
 */
@Entity
@Getter
@Setter
@Table(name = "admins")
public class Admin {

    /**
     * Unique identifier for the admin.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /**
     * Username for authentication.
     */
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * Hashed password for authentication.
     */
    @Column(nullable = false)
    private String passwordHash;

    /**
     * Email address of the admin.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Default constructor.
     */
    public Admin() {
    }

    /**
     * Constructor with all fields.
     *
     * @param usernameParam the username
     * @param passwordHashParam the hashed password
     * @param emailParam the email
     */
    public Admin(final String usernameParam,
                 final String passwordHashParam,
                 final String emailParam) {
        this.username = usernameParam;
        this.passwordHash = passwordHashParam;
        this.email = emailParam;
    }
}

