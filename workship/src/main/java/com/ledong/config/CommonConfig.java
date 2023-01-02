package com.ledong.config;

import com.ledong.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration(proxyBeanMethods = false)
public class CommonConfig implements WebMvcConfigurer {

    @Value("${spring.sms.id}")
    private  String ID;
    @Value("${spring.sms.code}")
    private  String CODE;

    @Bean
    public UserCases userCases(){
        return new UserCases() ;
    }


    @Bean
    public CardCases cardCases(){
        return new CardCases() ;
    }

    @Bean
    public WsHandler wsHandler(){return new WsHandler() ;   }

    @Bean
    public CourseCases courseCases(){return new CourseCases() ;   }

    @Bean
    public SmsCases smsCases(){return new SmsCases(ID,CODE) ;   }


}
