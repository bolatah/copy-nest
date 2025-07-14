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
                credentialsStream = new ByteArrayInputStream(configJson.getBytes());
            } else {
                credentialsStream = firebaseCredentialsResource.getInputStream();
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

        } catch (Exception e) {
            e.printStackTrace();

        }
    }
}
