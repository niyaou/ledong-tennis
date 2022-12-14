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
import org.springframework.util.StringUtils;
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


    @GetMapping("/spend")
    @ResponseBody
    public Object spend(@RequestParam(required = false)  String number ){
        return  cardCases.getSpend(number,1,1000);

    }

    @DeleteMapping("/course/{id}/{member}")
    public CourseResponseDTO removeMember(@PathVariable("id")Long courseId,@PathVariable("member")String number
                              ){
       var bo= courseCases.removeCourseMember(courseId,number);
        return CourseResponseDTO.builder()
                .build();
    }

    @DeleteMapping("/course/{id}")
    public CourseResponseDTO removeCourse(@PathVariable("id")Long courseId
    ){
        var bo= courseCases.removeCourse(courseId);
        return CourseResponseDTO.builder()
                .build();
    }

    @GetMapping("/course/total")
    public Object totalCourse(@RequestParam  String startTime,@RequestParam(required = false) String number,@RequestParam(required = false) Integer pageNum){
        if(StringUtils.hasText(number)){
            return courseCases.memberCourse(startTime,number,1,100);
        }else{
            if(pageNum==null ||pageNum<1){
                pageNum=1;
            }
            return courseCases.totalCourse(startTime,pageNum,1000);
        }

    }

}
