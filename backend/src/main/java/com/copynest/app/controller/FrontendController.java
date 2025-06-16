package com.copynest.app.controller;

import java.util.concurrent.TimeUnit;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // ✅ Serve root with cache headers
    @GetMapping(value = "/", produces = "text/html")
    public ResponseEntity<Resource> serveIndex() {
        Resource indexHtml = new ClassPathResource("static/index.html");

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());

        return ResponseEntity.ok().headers(headers).body(indexHtml);
    }

    // ✅ Serve ngsw-worker.js
    @GetMapping("/ngsw-worker.js")
    public ResponseEntity<Resource> serveServiceWorker() {
        Resource worker = new ClassPathResource("static/ngsw-worker.js");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(worker);
    }

    // ✅ Serve ngsw.json
    @GetMapping("/ngsw.json")
    public ResponseEntity<Resource> serveNgswJson() {
        Resource ngswJson = new ClassPathResource("static/ngsw.json");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(ngswJson);
    }

    // ✅ Serve manifest
    @GetMapping("/manifest.webmanifest")
    public ResponseEntity<Resource> serveManifest() {
        Resource manifest = new ClassPathResource("static/manifest.webmanifest");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(manifest);
    }

    // ✅ Forward only app routes (excluding known files/extensions)
    @RequestMapping(value = {
        "/{path:^(?!ngsw\\.json$|ngsw-worker\\.js$|manifest\\.webmanifest$|assets/|.*\\..+$).*$}",
        "/**/{path:^(?!ngsw\\.json$|ngsw-worker\\.js$|manifest\\.webmanifest$|assets/|.*\\..+$).*$}"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
