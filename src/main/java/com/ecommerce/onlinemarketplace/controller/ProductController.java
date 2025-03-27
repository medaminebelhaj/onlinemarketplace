package com.ecommerce.onlinemarketplace.controller;

import com.ecommerce.onlinemarketplace.entity.Product;
import com.ecommerce.onlinemarketplace.model.BrandResponse;
import com.ecommerce.onlinemarketplace.model.ProductResponse;
import com.ecommerce.onlinemarketplace.model.TypeResponse;
import com.ecommerce.onlinemarketplace.service.BrandService;
import com.ecommerce.onlinemarketplace.service.ProductService;
import com.ecommerce.onlinemarketplace.service.TypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final BrandService brandService;
    private final TypeService typeService;


    public ProductController(ProductService productService, BrandService brandService, TypeService typeService) {
        this.productService = productService;
        this.brandService = brandService;
        this.typeService = typeService;
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer productId) {
        ProductResponse productResponse = productService.getProductById(productId);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);


    }

    @GetMapping()
    //@PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "brandId", required = false) Integer brandId,
            @RequestParam(name = "typeId", required = false) Integer typeId,
            @RequestParam(name = "sort", defaultValue = "name") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order
    ){
        //Convert order to Sort direction
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC: Sort.Direction.ASC;
        Sort sorting = Sort.by(direction, sort);
        Pageable pageable = PageRequest.of(page, size, sorting);

        Page<ProductResponse> productResponses = productService.getProducts(pageable, brandId, typeId, keyword);
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponse>> getBrands(){
        List<BrandResponse> brandResponses = brandService.getAllBrands();
        return new ResponseEntity<>(brandResponses, HttpStatus.OK);
    }
    @PostMapping("/brands")
    public ResponseEntity<BrandResponse> createBrand(@RequestBody BrandResponse brandRequest) {
        try {
            BrandResponse createdBrand = brandService.addBrand(brandRequest);
            return new ResponseEntity<>(createdBrand, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // PUT method to update an existing brand
    @PutMapping("/brands/{id}")
    public ResponseEntity<BrandResponse> updateBrand(
            @PathVariable Integer id, @RequestBody BrandResponse brandRequest) {
        try {
            BrandResponse updatedBrand = brandService.updateBrand(id, brandRequest);
            return ResponseEntity.ok(updatedBrand);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // DELETE method to remove an existing brand
    @DeleteMapping("/brands/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) {
        try {
            brandService.deleteBrand(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/types")
    public ResponseEntity<List<TypeResponse>> getTypes(){
        List<TypeResponse> typeResponses = typeService.getAllTypes();
        return new ResponseEntity<>(typeResponses, HttpStatus.OK);
    }
    @PostMapping("/types")
    public ResponseEntity<TypeResponse> createType(@RequestBody TypeResponse typeRequest) {
        try {
            TypeResponse createdType = typeService.addType(typeRequest);
            return new ResponseEntity<>(createdType, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // PUT method to update an existing type
    @PutMapping("/types/{id}")
    public ResponseEntity<TypeResponse> updateType(
            @PathVariable Integer id, @RequestBody TypeResponse typeRequest) {
        try {
            TypeResponse updatedType = typeService.updateType(id, typeRequest);
            return ResponseEntity.ok(updatedType);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // DELETE method to remove an existing type
    @DeleteMapping("/types/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable Integer id) {
        try {
            typeService.deleteType(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Integer id, @RequestBody ProductResponse productDetails) {
        ProductResponse updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Integer productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductResponse productRequest) {
        try {
            ProductResponse createdProduct = productService.addProduct(productRequest);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadProductImage(@RequestParam("image") MultipartFile image) {
        try {
            String uploadDir = "C:/Users/dell/Downloads/onlinemarketplace/onlinemarketplace/client/public/images/products/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Ensure file name is valid
            String fileName = image.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid file name");
            }

            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Construct relative path for the image
            String imageUrl = "images/products/" + fileName;
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed: " + e.getMessage());
        }
    }




}
