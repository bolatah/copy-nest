package com.copynest.app.repository;

import com.copynest.app.entity.Nest;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NestRepository extends MongoRepository<Nest, String> {
    // You can define custom query methods here if necessary
    List<Nest> findByUid(String uid);

    Optional<Nest> findByIdAndUid(String id, String uid);
}
