package com.ecommerce.onlinemarketplace.service;

import com.ecommerce.onlinemarketplace.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User createUser(User user);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
    public Optional<User> findByUsername(String username);
}
