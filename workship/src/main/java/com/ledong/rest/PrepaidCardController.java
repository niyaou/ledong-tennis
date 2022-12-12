package com.ledong.rest;


import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
import com.ledong.entity.response.CourseResponseDTO;
import com.ledong.entity.response.SpendResponseDTO;
import com.ledong.entity.response.UserResponseDTO;
import com.ledong.service.CardCases;
import com.ledong.service.CourseCases;
import com.ledong.service.UserCases;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prepaidCard")
@Slf4j
public class PrepaidCardController {

    @Autowired
    private CourseCases courseCases;
    @Autowired
    private CardCases cardCases;


    @PostMapping("/course/create")
    public CourseResponseDTO register(@RequestParam  String startTime,
                                      @RequestParam String endTime,
                                      @RequestParam   String coachName,
                                      @RequestParam  float spendingTime,
                                      @RequestParam  String courtName,
                                      @RequestParam  String descript,
                                      @RequestParam  String membersObj){
        var course = Course.fromBO(courseCases.createCourse(startTime,endTime,coachName,spendingTime,courtName,descript,membersObj));
        return CourseResponseDTO.builder()
               .build();
    }


    @GetMapping("/spend/{number}")
    @ResponseBody
    public Object spend(@PathVariable("number")  String number ){
//        var spend= cardCases.getSpend(number);
//        System.out.println(spend);
//       var rres= JSONUtil.toJsonStr(spend);
        return  cardCases.getSpend(number,1,10);
//       var json= JSONUtil.parseArray(spend);
//        return spend;
    }



}
