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

import java.util.Map;

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
    public UserResponseDTO register(@RequestHeader(value = "secure", required = false) String secure,
            @RequestParam String name, @RequestParam String number, @RequestParam String court) {
        verifiedSecure(secure);
        var user = PrepaidCard.fromBO(useCase.create(name, number, court));
        return UserResponseDTO.builder()
                .token("------").user(user).build();
    }

    @PostMapping("/charged")
    public Object charged(@RequestHeader(value = "secure", required = false) String secure, 
    String number,
            @RequestParam(required = false) Float charged,
            @RequestParam(required = false) String time,
             @RequestParam(required = false) Float times,
            @RequestParam(required = false) Float annualTimes,
            @RequestParam(required = false) String annualExpireTime,
            @RequestParam(required = false) Integer worth,
            @RequestParam(required = true) String court,
            @RequestParam(required = true) String coach,
            @RequestParam(required = false) String description) {
        verifiedSecure(secure);
        var chargedLog = cardCase.setRestCharge(number, charged, times, annualTimes, annualExpireTime, worth, court,
                description, coach,time);
        return chargedLog;

    }

    @GetMapping("/charged/{number}")
    public Object charged(@PathVariable("number") String number) {
        return cardCase.getCharged(number, 1, 50);
    }

    @GetMapping("/charged/total")
    public Object charged(@RequestParam Integer pageSize) {
        return cardCase.getCharged(1, pageSize);
    }

    @GetMapping("/charged/coach/{number}")
    public Object coachCharged(@PathVariable("number") String number, @RequestParam String startTime,
            @RequestParam String endTime) {
        return cardCase.getChargedByCoach(number, startTime, endTime);
    }

    @PostMapping("/member/{number}")
    public Object yonthAndAdult(@PathVariable("number") String number, @RequestParam Integer yonth,
            @RequestParam Integer adult) {
        return useCase.setYonthAndAdult(number, yonth, adult);
    }

    @PostMapping("/charged/retreat/{id}")
    public ChargedResponseDTO charged(@RequestHeader(value = "secure", required = false) String secure,
            @PathVariable("id") Long id) {
        verifiedSecure(secure);
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
    public Object notify(@RequestHeader(value = "secure", required = false) String secure,
            @RequestParam(required = false) Long id) {
        verifiedSecure(secure);
        return courseCases.notify(id);
    }

    @GetMapping("/coach")
    public Object coaches() {
        return coachDAO.findByIsActive(1);
    }

    @GetMapping("/court")
    public Object courts() {
        return courtDAO.findAll();
    }

}
