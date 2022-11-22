package com.ledong.config;

import lombok.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration(proxyBeanMethods = false)
public class CommonCOnfig implements WebMvcConfigurer {
    @Value("${jwt.secret}")
    public String jwtSecret;

    @Value("${jwt.issuer}")
    public String jwtIssuer;

    @Value("${jwt.expireHours}")
    public Integer jwtExpireHours;


    @Bean
    public JwtHelper jwtHelper() {
        return new JwtHelper(jwtSecret, jwtIssuer, jwtExpireHours);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtHelper jwtHelper, UserUseCase userUseCase) {
        return new JwtAuthenticationFilter(jwtHelper, userUseCase);
    }
}
