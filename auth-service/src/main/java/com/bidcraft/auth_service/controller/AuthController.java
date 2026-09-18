package com.bidcraft.auth_service.controller;

import com.bidcraft.auth_service.dto.AuthResponse;
import com.bidcraft.auth_service.dto.LoginRequest;
import com.bidcraft.auth_service.dto.RegisterRequest;
import com.bidcraft.auth_service.dto.UserProfileResponse;
import com.bidcraft.auth_service.model.User;
import com.bidcraft.auth_service.repository.UserRepository;
import com.bidcraft.auth_service.security.CustomUserDetails;
import com.bidcraft.auth_service.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already taken");
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .build();

        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwt = jwtUtil.generateToken(userDetails);

        AuthResponse response = AuthResponse.builder()
                .token(jwt)
                .user(mapToProfileResponse(user))
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);

        AuthResponse response = AuthResponse.builder()
                .token(jwt)
                .user(mapToProfileResponse(userDetails.getUser()))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return ResponseEntity.ok(mapToProfileResponse(userDetails.getUser()));
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }
}
