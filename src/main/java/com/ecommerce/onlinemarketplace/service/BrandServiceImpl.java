package com.ecommerce.onlinemarketplace.service;
import com.ecommerce.onlinemarketplace.entity.Brand;
import com.ecommerce.onlinemarketplace.model.BrandResponse;
import com.ecommerce.onlinemarketplace.repository.BrandRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
@Service
@Log4j2
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public List<BrandResponse> getAllBrands() {
        log.info("Fetching All Brands!!!");
        //Fetch Brands
        List<Brand> brandList = brandRepository.findAll();
        //now use stream operator to map with Response
        List<BrandResponse> brandResponses = brandList.stream()
                .map(this::convertToBrandResponse)
                .collect(Collectors.toList());
        log.info("Fetched All Brands!!!");
        return brandResponses;
    }

    @Override
    public BrandResponse addBrand(BrandResponse brandRequest) {
        log.info("Adding a new brand: {}", brandRequest.getName());
        // Create a new Brand entity
        Brand brand = new Brand();
        brand.setName(brandRequest.getName());

        // Save the brand to the database
        Brand savedBrand = brandRepository.save(brand);

        log.info("Brand added successfully with ID: {}", savedBrand.getId());
        // Convert and return the response
        return convertToBrandResponse(savedBrand);
    }

    @Override
    public BrandResponse updateBrand(Integer id, BrandResponse brandRequest) {
        log.info("Updating brand with ID: {}", id);
        // Fetch the existing brand
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + id));

        // Update the brand name
        brand.setName(brandRequest.getName());

        // Save the updated brand to the database
        Brand updatedBrand = brandRepository.save(brand);

        log.info("Brand updated successfully with ID: {}", updatedBrand.getId());
        // Convert and return the response
        return convertToBrandResponse(updatedBrand);
    }

    @Override
    public void deleteBrand(Integer id) {
        log.info("Deleting brand with ID: {}", id);
        // Fetch the brand to ensure it exists
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + id));

        // Delete the brand
        brandRepository.delete(brand);
        log.info("Brand with ID: {} has been deleted", id);
    }

    private BrandResponse convertToBrandResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }
}
