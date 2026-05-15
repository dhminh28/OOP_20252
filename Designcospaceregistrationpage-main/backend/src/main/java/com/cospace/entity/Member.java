package com.cospace.entity;

import com.cospace.enums.UserRole;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("MEMBER")
public class Member extends User {

    @OneToOne(mappedBy = "member")
    private Wallet wallet;

    @OneToMany(mappedBy = "member")
    private List<Booking> bookings = new ArrayList<>();

    public Member() {
        setRole(UserRole.MEMBER);
    }

    public Wallet getWallet() {
        return wallet;
    }

    public List<Booking> getBookings() {
        return bookings;
    }
}
