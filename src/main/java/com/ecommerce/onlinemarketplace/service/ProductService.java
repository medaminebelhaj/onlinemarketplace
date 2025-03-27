package com.ecommerce.onlinemarketplace.service;

import com.ecommerce.onlinemarketplace.entity.Product;
import com.ecommerce.onlinemarketplace.model.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface ProductService {
    ProductResponse getProductById(Integer productId);
    Page<ProductResponse> getProducts(Pageable pageable, Integer brandId, Integer typeId, String keyword);

    void deleteProduct(Integer productId);

    ProductResponse updateProduct(Integer productId, ProductResponse productRequest);

    ProductResponse addProduct(ProductResponse productDetails);

}
