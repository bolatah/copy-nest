

import java.io.IOException;
import java.nio.file.*;

public class ConfigFileCopier {
    public static void main(String[] args) {
        Path basePath = Paths.get(System.getProperty("user.dir"));
        Path configDir = basePath.resolve("../config-files").normalize();
        Path targetDir = basePath.resolve("src/main/resources").normalize();

        String[] files = {
            "application.properties",
            "copy-nest-firebase-adminsdk-fbsvc-b66c81829d.json"
        };

        for (String filename : files) {
            Path source = configDir.resolve(filename);
            Path target = targetDir.resolve(filename);

            try {
                Files.createDirectories(targetDir);
                Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("✅ Copied: " + source + " → " + target);
            } catch (NoSuchFileException e) {
                System.out.println("⚠️  File not found: " + source);
            } catch (IOException e) {
                System.err.println("❌ Failed to copy " + filename + ": " + e.getMessage());
            }
        }
    }
}