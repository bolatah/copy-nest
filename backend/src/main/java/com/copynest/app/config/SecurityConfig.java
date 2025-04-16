package com.copynest.app.config;

import com.copynest.app.security.FirebaseAuthFilter;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

    private final FirebaseAuthFilter firebaseAuthFilter;

    public SecurityConfig(FirebaseAuthFilter firebaseAuthFilter) {
        this.firebaseAuthFilter = firebaseAuthFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> allowedOrigins = Arrays.asList(
            "http://localhost:4200",             // Angular dev server on local machine
            "http://192.168.159.197:4200",       // Accessing Angular dev server from mobile device
            "http://192.168.159.197:8800",       // Accessing built Angular app from mobile (if served on 8800)
            "http://10.0.2.2:4200",              // Android Emulator (maps to host)
            "capacitor://localhost"             // Capacitor WebView
        );
        configuration.setAllowedOrigins(allowedOrigins);

        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");

        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource)
            throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/favicon.ico",
                                "/favicon.svg",
                                "/assets/**",
                                "/*.js",
                                "/*.css",
                                "/*.woff2", "/*.woff", "/*.ttf", "/*.eot",
                                "/manifest.json",
                                "*.webmanifest",
                                "/ngsw-worker.js",
                                "/**/*.js", "/**/*.css",
                                "/{path:[^\\.]*}", "/**/{path:[^\\.]*}")
                        .permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(firebaseAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
