package com.ecommerce.onlinemarketplace.controller;

import com.ecommerce.onlinemarketplace.entity.User;
import com.ecommerce.onlinemarketplace.model.JwtRequest;
import com.ecommerce.onlinemarketplace.model.JwtResponse;
import com.ecommerce.onlinemarketplace.model.UserResponse;
import com.ecommerce.onlinemarketplace.repository.UserRepository;
import com.ecommerce.onlinemarketplace.security.JwtHelper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserDetailsService userDetailsService;
    private final AuthenticationManager manager;
    private final JwtHelper jwtHelper;
    private final UserRepository userRepository;

    public AuthController(UserDetailsService userDetailsService, AuthenticationManager manager, JwtHelper jwtHelper, UserRepository userRepository) {
        this.userDetailsService = userDetailsService;
        this.manager = manager;
        this.jwtHelper = jwtHelper;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {
        authenticate(request.getUsername(), request.getPassword());
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtHelper.generateToken(userDetails);

        // Get the single role
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("USER"); // Default role if no role is found

        JwtResponse response = JwtResponse.builder()
                .username(userDetails.getUsername())
                .token(token)
                .role(role) // Add the single role
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/api/user/details")
    public ResponseEntity<UserResponse> getUserDetails(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getRole(),user.getEmail());
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/user")
    public ResponseEntity<UserDetails> getUserDetails(@RequestHeader("Authorization") String tokenHeader) {
        String token = extractTokenFromHeader(tokenHeader);
        if (token != null) {
            String username = jwtHelper.getUserNameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            return new ResponseEntity<>(userDetails, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private String extractTokenFromHeader(String tokenHeader) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            return tokenHeader.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }

    private void authenticate(String username, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        try {
            manager.authenticate(authenticationToken);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid Username or Password");
        }
    }
}
