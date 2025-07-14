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

    public Nest saveNest(Nest nest) {
        return nestRepository.save(nest);
    }

    public List<Nest> getNestsByUid(String uid) {
        return nestRepository.findByUid(uid);
    }

    public Optional<Nest> getNestByIdForUser(String id, String uid) {
        return nestRepository.findByIdAndUid(id, uid);
    }

    public Nest updateNestForUser(String id, Nest updatedNest, String uid) {
        Optional<Nest> existingNest = nestRepository.findByIdAndUid(id, uid);
        if (existingNest.isPresent()) {
            updatedNest.setId(id);
            updatedNest.setUid(uid);
            return nestRepository.save(updatedNest);
        }
        return null;
    }

    public boolean deleteNestForUser(String id, String uid) {
        Optional<Nest> existingNest = nestRepository.findByIdAndUid(id, uid);
        if (existingNest.isPresent()) {
            nestRepository.deleteById(id);
            return true;
        }
        return false;
    }
}