package com.ecommerce.onlinemarketplace.repository;

import com.ecommerce.onlinemarketplace.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    Optional<Brand> findByName(String productBrand);
}