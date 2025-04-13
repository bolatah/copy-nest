package com.copynest.app.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HEADER);
        
        // If the header is present and starts with the Bearer prefix
        if (header != null && header.startsWith(PREFIX)) {
            String token = header.replace(PREFIX, "");
            System.out.println("filter is initialized");

            try {
                // Verify the Firebase token
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                // Set the decoded token as an attribute in the request
                request.setAttribute("firebaseUser", decodedToken);

                // Set the authentication object in the SecurityContext for Spring Security
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                                decodedToken.getEmail(), null, Collections.emptyList());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication in the security context
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // If there's any error, return an Unauthorized response
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid Firebase Token: " + e.getMessage());
                return;
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
