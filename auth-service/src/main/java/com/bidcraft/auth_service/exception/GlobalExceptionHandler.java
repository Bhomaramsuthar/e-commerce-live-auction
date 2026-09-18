package com.bidcraft.auth_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<Map<String, String>> errorList = new ArrayList<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            Map<String, String> fieldError = new HashMap<>();
            fieldError.put("field", error.getField());
            fieldError.put("message", error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value");
            errorList.add(fieldError);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Validation failed");
        response.put("errors", errorList);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString());

        List<Map<String, String>> errorList = new ArrayList<>();
        if (ex.getStatusCode() == HttpStatus.CONFLICT) {
            Map<String, String> fieldError = new HashMap<>();
            fieldError.put("field", "email");
            fieldError.put("message", ex.getReason() != null ? ex.getReason() : "Email is already taken");
            errorList.add(fieldError);
        } else if (ex.getStatusCode() == HttpStatus.BAD_REQUEST && "Passwords do not match".equalsIgnoreCase(ex.getReason())) {
            Map<String, String> fieldError = new HashMap<>();
            fieldError.put("field", "confirmPassword");
            fieldError.put("message", "Passwords do not match");
            errorList.add(fieldError);
        }

        if (!errorList.isEmpty()) {
            response.put("errors", errorList);
        }

        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Invalid email or password");

        List<Map<String, String>> errorList = new ArrayList<>();
        Map<String, String> emailError = new HashMap<>();
        emailError.put("field", "email");
        emailError.put("message", "Invalid credentials");
        errorList.add(emailError);

        Map<String, String> passError = new HashMap<>();
        passError.put("field", "password");
        passError.put("message", "Invalid credentials");
        errorList.add(passError);

        response.put("errors", errorList);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
