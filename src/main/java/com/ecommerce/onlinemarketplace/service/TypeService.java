package com.ecommerce.onlinemarketplace.service;

import com.ecommerce.onlinemarketplace.model.TypeResponse;
import java.util.List;
public interface TypeService {
    List<TypeResponse> getAllTypes();

    void deleteType(Integer id);

    TypeResponse updateType(Integer id, TypeResponse typeRequest);

    TypeResponse addType(TypeResponse typeRequest);
}
