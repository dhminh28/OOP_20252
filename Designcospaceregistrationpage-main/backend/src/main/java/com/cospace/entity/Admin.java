package com.cospace.entity;

import com.cospace.enums.UserRole;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    public Admin() {
        setRole(UserRole.ADMIN);
    }
}
