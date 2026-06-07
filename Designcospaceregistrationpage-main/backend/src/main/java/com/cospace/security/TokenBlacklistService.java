package com.cospace.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String token, Date expirationTime) {
        if (token == null || token.isBlank() || expirationTime == null) {
            return;
        }

        long expirationEpochMs = expirationTime.getTime();
        if (expirationEpochMs > System.currentTimeMillis()) {
            blacklistedTokens.put(token, expirationEpochMs);
        }
    }

    public boolean isBlacklisted(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        Long expirationEpochMs = blacklistedTokens.get(token);
        if (expirationEpochMs == null) {
            return false;
        }
        if (expirationEpochMs <= System.currentTimeMillis()) {
            blacklistedTokens.remove(token, expirationEpochMs);
            return false;
        }
        return true;
    }

    @Scheduled(fixedDelayString = "${app.jwt.blacklist-cleanup-ms:3600000}")
    void removeExpiredTokens() {
        long now = System.currentTimeMillis();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue() <= now);
    }
}
