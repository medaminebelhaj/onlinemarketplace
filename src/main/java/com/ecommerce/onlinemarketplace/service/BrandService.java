package com.ecommerce.onlinemarketplace.service;

import com.ecommerce.onlinemarketplace.model.BrandResponse;
import java.util.List;
public interface BrandService {
    List<BrandResponse> getAllBrands();
    public BrandResponse addBrand(BrandResponse brandRequest);
    public BrandResponse updateBrand(Integer id, BrandResponse brandRequest);
    public void deleteBrand(Integer id);
}
