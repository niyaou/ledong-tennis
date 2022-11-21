package com.ledong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.ledong")
public class WorkshipApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorkshipApplication.class, args);
    }
}
