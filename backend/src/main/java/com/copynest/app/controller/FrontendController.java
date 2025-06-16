package com.copynest.app.controller;

import java.util.concurrent.TimeUnit;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // ✅ Serve index.html for root
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<Resource> serveIndex() {
        Resource indexHtml = new ClassPathResource("static/index.html");

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.TEXT_HTML)
                .body(indexHtml);
    }

    // ✅ Serve ngsw-worker.js with correct MIME type
    @GetMapping("/ngsw-worker.js")
    public ResponseEntity<Resource> serveServiceWorker() {
        Resource worker = new ClassPathResource("static/ngsw-worker.js");

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.noStore());
        headers.setContentType(MediaType.valueOf("text/javascript"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(worker);
    }

    // ✅ Serve ngsw.json
    @GetMapping("/ngsw.json")
    public ResponseEntity<Resource> serveNgswJson() {
        Resource ngswJson = new ClassPathResource("static/ngsw.json");

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.noStore());
        headers.setContentType(MediaType.APPLICATION_JSON);

        return ResponseEntity.ok()
                .headers(headers)
                .body(ngswJson);
    }

    // ✅ Serve manifest.webmanifest
    @GetMapping("/manifest.webmanifest")
    public ResponseEntity<Resource> serveManifest() {
        Resource manifest = new ClassPathResource("static/manifest.webmanifest");

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.noStore());
        headers.setContentType(MediaType.valueOf("application/manifest+json"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(manifest);
    }

    // ✅ Forward all non-static routes to index.html (Angular routing support)
    @RequestMapping({
        "/{path:^(?!ngsw\\.json$|ngsw-worker\\.js$|manifest\\.webmanifest$|assets/|.*\\..+$).*$}",
        "/**/{path:^(?!ngsw\\.json$|ngsw-worker\\.js$|manifest\\.webmanifest$|assets/|.*\\..+$).*$}"
    })
    public ResponseEntity<Resource> forwardToIndexHtml() {
        Resource indexHtml = new ClassPathResource("index.html");

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .cacheControl(CacheControl.noStore())
                .body(indexHtml);
    }
}
