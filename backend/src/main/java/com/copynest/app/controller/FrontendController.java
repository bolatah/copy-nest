package com.copynest.app.controller;

import java.util.concurrent.TimeUnit;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // Serve index.html with cache control — from /static/
    @GetMapping(value = "/", produces = "text/html")
    public ResponseEntity<Resource> serveIndex() {
        Resource indexHtml = new ClassPathResource("/static/index.html"); // ✅ Ensure it's from /static

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic()); // Optional: reduce to 1h to avoid stale

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(indexHtml);
    }

    // Catch-all routing for Angular SPA (except static files and SW files)
    @RequestMapping(value = {
            "/{path:^(?!ngsw|api|assets|favicon|manifest|.*\\.\\w+).*}",
            "/**/{path:^(?!ngsw|api|assets|favicon|manifest|.*\\.\\w+).*}"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
