package com.ledong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(scanBasePackages = "com.ledong")
@EnableTransactionManagement
@EnableJpaAuditing
public class WorkshipApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorkshipApplication.class, args);
    }
}
