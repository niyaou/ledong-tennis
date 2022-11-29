package com.ledong.rest;

import com.ledong.entity.PrepaidCard;
import com.ledong.entity.response.UserResponseDTO;
import com.ledong.exception.UseCaseCode;
import com.ledong.service.UserCases;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@Validated
@Slf4j
public class UserController extends  BaseController{

    @Autowired
    private UserCases useCase;

    @PostMapping("/register")
    public UserResponseDTO register(@RequestParam String name,@RequestParam String number){
        var user = PrepaidCard.fromBO(useCase.create(name,number));
        return UserResponseDTO.builder()
                .token("------").user(user).build();
    }

}
