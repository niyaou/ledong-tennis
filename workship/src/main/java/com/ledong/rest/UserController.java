package com.ledong.rest;

import com.ledong.dao.CoachDAO;
import com.ledong.dao.CourtDAO;
import com.ledong.entity.PrepaidCard;
import com.ledong.entity.response.ChargedResponseDTO;
import com.ledong.entity.response.UserResponseDTO;
import com.ledong.exception.UseCaseCode;
import com.ledong.service.CardCases;
import com.ledong.service.CourseCases;
import com.ledong.service.UserCases;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Validated
@Slf4j
public class UserController extends BaseController {

    @Autowired
    private UserCases useCase;

    @Autowired
    private CardCases cardCase;

    @Autowired
    private CoachDAO coachDAO;

    @Autowired
    private CourtDAO courtDAO;

    @Autowired
    private CourseCases courseCases;

    @PostMapping("/register")
    public UserResponseDTO register(@RequestParam String name, @RequestParam String number) {
        var user = PrepaidCard.fromBO(useCase.create(name, number));
        return UserResponseDTO.builder()
                .token("------").user(user).build();
    }


    @PostMapping("/charged")
    public ChargedResponseDTO charged(String number, float charged, float times, float annualTimes, String description) {
        var chargedLog = cardCase.setRestCharge(number, charged, times, annualTimes, description);
        return ChargedResponseDTO.builder().charge(charged).description(description).chargedTime(chargedLog.getChargedTime()).build();

    }

    @PostMapping("/charged/retreat/{id}")
    public ChargedResponseDTO charged(@PathVariable("id") Long id) {
        var chargedLog = cardCase.retreatCharge(id);
        return ChargedResponseDTO.builder().build();
    }

    @GetMapping("/")
    public Object members(@RequestParam(required = false) String number) {
        if (StringUtils.hasText(number)) {
            return useCase.getMember(number);
        } else {
            return useCase.getMembers();
        }

    }


    @PostMapping("/course/notify")
    public Object notify(@RequestParam(required = false) Long id) {
        return  courseCases.notify(id);
    }


    @GetMapping("/coach")
    public Object coaches() {
        return coachDAO.findAll();
    }

    @GetMapping("/court")
    public Object courts() {
        return courtDAO.findAll();
    }


}
