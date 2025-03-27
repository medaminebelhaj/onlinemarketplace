package com.ecommerce.onlinemarketplace.service;

import com.ecommerce.onlinemarketplace.entity.Type;
import com.ecommerce.onlinemarketplace.model.TypeResponse;
import com.ecommerce.onlinemarketplace.repository.TypeRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class TypeServiceImpl implements TypeService {
    private final TypeRepository typeRepository;

    public TypeServiceImpl(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    @Override
    public List<TypeResponse> getAllTypes() {
        log.info("Fetching All Types!!!");
        //Fetch Types from DB
        List<Type> typeList = typeRepository.findAll();
        //now use stream operator to map with Response
        List<TypeResponse> typeResponses = typeList.stream()
                .map(this::convertToTypeResponse)
                .collect(Collectors.toList());
        return typeResponses;
    }

    @Override
    public void deleteType(Integer id) {
        log.info("Deleting Type with ID: {}", id);
        // Fetch the Type to ensure it exists
        Type type = typeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Type not found with ID: " + id));

        // Delete the Type
        typeRepository.delete(type);
        log.info("Type with ID: {} has been deleted", id);
    }

    @Override
    public TypeResponse updateType(Integer id, TypeResponse typeRequest) {
        log.info("Updating Type with ID: {}", id);
        // Fetch the existing Type
        Type type = typeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Type not found with ID: " + id));

        // Update the Type name
        type.setName(typeRequest.getName());

        // Save the updated Type to the database
        Type updatedType = typeRepository.save(type);

        log.info("Type updated successfully with ID: {}", updatedType.getId());
        // Convert and return the response
        return convertToTypeResponse(updatedType);
    }

    @Override
    public TypeResponse addType(TypeResponse typeRequest) {
        log.info("Adding a new Type: {}", typeRequest.getName());
        // Create a new Type entity
        Type type = new Type();
        type.setName(typeRequest.getName());

        // Save the type to the database
        Type savedType = typeRepository.save(type);

        log.info("Type added successfully with ID: {}", savedType.getId());
        // Convert and return the response
        return convertToTypeResponse(savedType);
    }

    private TypeResponse convertToTypeResponse(Type type) {
        return TypeResponse.builder()
                .id(Math.toIntExact(type.getId()))
                .name(type.getName())
                .build();
    }
}