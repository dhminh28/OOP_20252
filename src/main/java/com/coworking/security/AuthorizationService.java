package com.coworking.security;

import com.coworking.exception.AuthorizationException;
import com.coworking.model.Role;
import com.coworking.model.User;

public class AuthorizationService {
    public void requireAnyRole(User user, Role... allowedRoles) {
        for (Role role : allowedRoles) {
            if (user.getRole() == role) {
                return;
            }
        }
        throw new AuthorizationException("User is not allowed to perform this action.");
    }
}

