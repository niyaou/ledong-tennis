package com.ledong.rest;

import com.ledong.entity.PrepaidCard;
import com.ledong.entity.response.ChargedResponseDTO;
import com.ledong.entity.response.UserResponseDTO;
import com.ledong.exception.UseCaseCode;
import com.ledong.service.CardCases;
import com.ledong.service.UserCases;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Validated
@Slf4j
public class UserController extends  BaseController{

    @Autowired
    private UserCases useCase;

    @Autowired
    private CardCases cardCase;

    @PostMapping("/register")
    public UserResponseDTO register(@RequestParam String name,@RequestParam String number){
        var user = PrepaidCard.fromBO(useCase.create(name,number));
        return UserResponseDTO.builder()
                .token("------").user(user).build();
    }


    @PostMapping("/charged")
    public ChargedResponseDTO charged(String number,float charged,float times,float annualTimes, String description){
       var chargedLog= cardCase.setRestCharge(number,charged,times,annualTimes,description);
        return  ChargedResponseDTO.builder().charge(charged).description(description).chargedTime(chargedLog.getChargedTime()).build();

    }

    @PostMapping("/charged/retreat/{id}")
    public ChargedResponseDTO charged(@PathVariable("id")Long id){
        var chargedLog= cardCase.retreatCharge(id);
        return  ChargedResponseDTO.builder().build();

    }

}
