package com.copynest.app.controller;

import com.copynest.app.entity.Nest;
import com.copynest.app.service.NestService;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/nests")
public class NestController {

    private final NestService nestService;

    public NestController(NestService nestService) {
        this.nestService = nestService;
    }

    @GetMapping
    public ResponseEntity<List<Nest>> getUserNests(HttpServletRequest request) {
        FirebaseToken token = (FirebaseToken) request.getAttribute("firebaseUser");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String uid = token.getUid();
        List<Nest> userNests = nestService.getNestsByUid(uid);
        return ResponseEntity.ok(userNests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nest> getNestById(@PathVariable String id, HttpServletRequest request) {
        FirebaseToken token = (FirebaseToken) request.getAttribute("firebaseUser");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String uid = token.getUid();
        Optional<Nest> nest = nestService.getNestByIdForUser(id, uid);
        return nest.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Nest> createNest(@RequestBody Nest nest, HttpServletRequest request) {
        FirebaseToken token = (FirebaseToken) request.getAttribute("firebaseUser");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String uid = token.getUid();
        nest.setUid(uid); // Set UID before saving
        Nest createdNest = nestService.saveNest(nest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nest> updateNest(@PathVariable String id, @RequestBody Nest nest, HttpServletRequest request) {
        FirebaseToken token = (FirebaseToken) request.getAttribute("firebaseUser");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String uid = token.getUid();
        Nest updatedNest = nestService.updateNestForUser(id, nest, uid);
        if (updatedNest != null) {
            return ResponseEntity.ok(updatedNest);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNest(@PathVariable String id, HttpServletRequest request) {
        FirebaseToken token = (FirebaseToken) request.getAttribute("firebaseUser");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String uid = token.getUid();
        boolean isDeleted = nestService.deleteNestForUser(id, uid);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
