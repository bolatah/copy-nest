package com.copynest.app.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
public class FirebaseAdminConfig {

    @Value("${firebase.credentials.path}")
    private Resource firebaseCredentials;

    @PostConstruct
    public void initFirebase() {
        try (InputStream serviceAccount = firebaseCredentials.getInputStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
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
