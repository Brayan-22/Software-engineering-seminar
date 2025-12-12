package com.udistrital.authback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object for login requests.
 */
@Getter
@Setter
@AllArgsConstructor
public class LoginRequestDTO {
    /**
     * The username for authentication.
     */
    private String username;

    /**
     * The password for authentication.
     */
    private String password;
}

