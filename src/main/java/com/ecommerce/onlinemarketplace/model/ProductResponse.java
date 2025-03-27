package com.ecommerce.onlinemarketplace.model;

import com.ecommerce.onlinemarketplace.entity.Brand;
import com.ecommerce.onlinemarketplace.entity.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Integer id;
    private String name;
    private String description;
    private Long price;
    private String pictureUrl;
    private String productBrand;
    private String productType;
}