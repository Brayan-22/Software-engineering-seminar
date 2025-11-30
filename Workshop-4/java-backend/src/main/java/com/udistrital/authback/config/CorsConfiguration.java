package com.udistrital.authback.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration for the application.
 */
@Configuration
public final class CorsConfiguration {

    /**
     * Maximum age for CORS preflight requests in seconds (1 hour).
     */
    private static final long MAX_AGE_SECONDS = 3600L;

    /**
     * Private constructor to prevent instantiation.
     */
    private CorsConfiguration() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Configures CORS mappings for the application.
     *
     * @return WebMvcConfigurer with CORS configuration
     */
    @Bean
    public static WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(final CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOriginPatterns("*")
                    .allowedMethods("*")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(MAX_AGE_SECONDS);
            }
        };
    }

}

