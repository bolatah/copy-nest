package com.copynest.app.service;

import com.copynest.app.entity.Nest;
import com.copynest.app.repository.NestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NestService {

    private final NestRepository nestRepository;

    public NestService(NestRepository nestRepository) {
        this.nestRepository = nestRepository;
    }

    // 🔐 Save a nest for the current user
    public Nest saveNest(Nest nest) {
        return nestRepository.save(nest);
    }

    // 🔐 Get all nests for a specific user
    public List<Nest> getNestsByUid(String uid) {
        return nestRepository.findByUid(uid);
    }

    // 🔐 Get a specific nest by ID and user
    public Optional<Nest> getNestByIdForUser(String id, String uid) {
        return nestRepository.findByIdAndUid(id, uid);
    }

    // 🔐 Update a nest (only if it belongs to the user)
    public Nest updateNestForUser(String id, Nest updatedNest, String uid) {
        Optional<Nest> existingNest = nestRepository.findByIdAndUid(id, uid);
        if (existingNest.isPresent()) {
            updatedNest.setId(id);
            updatedNest.setUid(uid);
            return nestRepository.save(updatedNest);
        }
        return null;
    }

    // 🔐 Delete a nest (only if it belongs to the user)
    public boolean deleteNestForUser(String id, String uid) {
        Optional<Nest> existingNest = nestRepository.findByIdAndUid(id, uid);
        if (existingNest.isPresent()) {
            nestRepository.deleteById(id);
            return true;
        }
        return false;
    }
}