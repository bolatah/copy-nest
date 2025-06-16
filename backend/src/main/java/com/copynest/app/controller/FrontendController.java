package com.copynest.app.controller;

import java.util.concurrent.TimeUnit;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {


    // ✅ Serve index.html with long-term cache headers
    @GetMapping(value = "/", produces = "text/html")
    public ResponseEntity<Resource> serveIndexWithCacheHeaders() {
        Resource indexHtml = new ClassPathResource("static/index.html");

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(indexHtml);
    }
    // Match all routes not containing a dot (e.g. ".js", ".css", ".svg", etc.)
    @RequestMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
