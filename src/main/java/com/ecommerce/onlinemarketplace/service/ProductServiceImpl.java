package com.ecommerce.onlinemarketplace.service;

import com.ecommerce.onlinemarketplace.entity.Brand;
import com.ecommerce.onlinemarketplace.entity.Product;

import com.ecommerce.onlinemarketplace.entity.Type;
import com.ecommerce.onlinemarketplace.model.ProductResponse;
import com.ecommerce.onlinemarketplace.repository.BrandRepository;
import com.ecommerce.onlinemarketplace.repository.ProductRepository;
import com.ecommerce.onlinemarketplace.repository.TypeRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final TypeRepository typeRepository;

    public ProductServiceImpl(ProductRepository productRepository, BrandRepository brandRepository, TypeRepository typeRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.typeRepository = typeRepository;
    }

    @Override
    public ProductResponse getProductById(Integer productId) {
        log.info("fetching Product by Id: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product doesn't exist"));
        //now convert the Product to Product Response
        ProductResponse productResponse = convertToProductResponse(product);
        log.info("Fetched Product by Product Id: {}", productId);
        return productResponse;
    }

    @Override
    public Page<ProductResponse> getProducts(Pageable pageable, Integer brandId, Integer typeId, String keyword) {
        Specification<Product> spec = Specification.where(null);

        if (brandId != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("brand").get("id"), brandId));
        }

        if (typeId != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type").get("id"), typeId));
        }

        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("name"), "%" + keyword + "%"));
        }

        return productRepository.findAll(spec, pageable).map(this::convertToProductResponse);
    }

    @Override
    public void deleteProduct(Integer productId) {
        log.info("Deleting Product by Id: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product doesn't exist"));
        productRepository.delete(product);
        log.info("Product with Id: {} has been deleted.", productId);
    }

    @Override
    public ProductResponse updateProduct(Integer productId, ProductResponse productRequest) {
        log.info("Updating Product by Id: {}", productId);

        // Fetch the existing Product entity
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product doesn't exist"));

        // Update simple fields
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setPictureUrl(productRequest.getPictureUrl());

        // Update Brand association
        if (productRequest.getProductBrand() != null) {
            Brand brand = brandRepository.findByName(productRequest.getProductBrand())
                    .orElseThrow(() -> new RuntimeException("Brand not found: " + productRequest.getProductBrand()));
            product.setBrand(brand);
        }

        // Update Type association
        if (productRequest.getProductType() != null) {
            Type type = typeRepository.findByName(productRequest.getProductType())
                    .orElseThrow(() -> new RuntimeException("Type not found: " + productRequest.getProductType()));
            product.setType(type);
        }

        // Log the updated Product object before saving
        log.info("Updated Product Before Save: {}", product);

        // Save the updated Product entity
        Product updatedProduct = productRepository.save(product);

        log.info("Product with Id: {} has been updated successfully.", productId);

        // Convert the updated Product entity to ProductResponse and return
        return convertToProductResponse(updatedProduct);
    }


    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .pictureUrl(product.getPictureUrl())
                .productBrand(product.getBrand().getName())
                .productType(product.getType().getName())
                .build();
    }

    @Override
    public ProductResponse addProduct(ProductResponse productDetails) {
        log.info("Adding new product: {}", productDetails.getName());
        try {
            Product product = new Product();
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setPictureUrl(productDetails.getPictureUrl());

            Brand brand = brandRepository.findByName(productDetails.getProductBrand())
                    .orElseThrow(() -> new RuntimeException("Brand not found: " + productDetails.getProductBrand()));
            product.setBrand(brand);

            Type type = typeRepository.findByName(productDetails.getProductType())
                    .orElseThrow(() -> new RuntimeException("Type not found: " + productDetails.getProductType()));
            product.setType(type);

            Product savedProduct = productRepository.save(product);
            log.info("Product added successfully with ID: {}", savedProduct.getId());
            return convertToProductResponse(savedProduct);
        } catch (Exception e) {
            log.error("Error while adding product: {}", e.getMessage(), e);
            throw e;
        }
    }
}