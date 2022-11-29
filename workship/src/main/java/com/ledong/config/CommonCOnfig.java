package com.ledong.config;

import com.ledong.service.UserCases;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration(proxyBeanMethods = false)
public class CommonCOnfig implements WebMvcConfigurer {

    @Bean
    public UserCases userCases(){
        return new UserCases() ;
    }
}
