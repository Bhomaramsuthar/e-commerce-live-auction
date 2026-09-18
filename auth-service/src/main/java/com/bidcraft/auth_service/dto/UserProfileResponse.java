package com.bidcraft.auth_service.dto;

import com.bidcraft.auth_service.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private String id;
    private String name;
    private String email;
    private String phoneNumber;
    private Role role;
}
