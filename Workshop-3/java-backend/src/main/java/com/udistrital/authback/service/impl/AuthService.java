package com.udistrital.authback.service.impl;

import com.udistrital.authback.dto.LoginRequestDTO;
import com.udistrital.authback.dto.ValidateTokenRequestDTO;
import com.udistrital.authback.dto.ValidateTokenResponseDTO;

public interface AuthService {
    String login(LoginRequestDTO request);
    ValidateTokenResponseDTO validateToken(ValidateTokenRequestDTO request);
}
