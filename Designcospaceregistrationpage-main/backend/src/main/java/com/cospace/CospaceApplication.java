package com.cospace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class CospaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CospaceApplication.class, args);
    }
}
