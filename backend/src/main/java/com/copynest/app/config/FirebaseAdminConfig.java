package com.copynest.app.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Component
public class FirebaseAdminConfig {

    @Value("${firebase.credentials.path}")
    private Resource firebaseCredentialsResource;

    @PostConstruct
    public void initFirebase() {
        try {
            InputStream credentialsStream;

            String configJson = System.getenv("CONFIG_JSON");

            if (configJson != null && !configJson.isBlank()) {
                System.out.println("🌐 Using Firebase credentials from CONFIG_JSON environment variable.");
                credentialsStream = new ByteArrayInputStream(configJson.getBytes());
            } else {
                System.out.println("📁 Using Firebase credentials from application.properties file path.");
                credentialsStream = firebaseCredentialsResource.getInputStream();
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            System.out.println("✅ Firebase initialized successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("❌ Failed to initialize Firebase Admin SDK.");
        }
    }
}
