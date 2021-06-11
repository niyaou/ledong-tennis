package ledong.wxapp.rest;

import VO.LdRankInfoVo;
import com.alibaba.fastjson.JSON;
import io.jsonwebtoken.Claims;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.CommonConstanst;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.entity.CommonResponse;
import ledong.wxapp.service.ICourseService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import org.apache.http.auth.AuthenticationException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;

@RequestMapping(value = "/course")
@RestController
@Api(value = "CourseController management", tags = "UserController")
@Validated
public class CourseController {
    private static Logger logger = Logger.getLogger(CourseController.class);
    @Autowired
    private IUserService userService;
    @Autowired
    private IRankService rankService;

    @Autowired
    private JwtToken tokenService;


    @Autowired
    private ICourseService courseService;


    @RequestMapping(value = "/ld/createCourse", method = RequestMethod.POST)
    @ApiOperation(value = "createCourse ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "startTime", value = "startTime ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "endTime", value = "endTime ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "coach", value = "coach ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "isExperience", value = "isExperience ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "isDealing", value = "isDealing ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "spendingTime", value = "spendingTime ", required = true, dataType = "double", paramType = "query"),
            @ApiImplicitParam(name = "courtSpend", value = "courtSpend ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "coachSpend", value = "coachSpend ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "court", value = "court ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "membersObj", value = "membersObj ", required = true, dataType = "string", paramType = "query"),
    })
    public ResponseEntity<?> createCourse(@RequestHeader("Authorization") String authHeader,
                                        @RequestParam(value = "startTime", required = true) String startTime,
                                        @RequestParam(value = "endTime", required = true) String endTime,
                                        @RequestParam(value = "coach", required = true) String coach,
                                        @RequestParam(value = "isExperience", required = true) Integer isExperience,
                                        @RequestParam(value = "isDealing", required = true) Integer isDealing,
                                        @RequestParam(value = "spendingTime", required = true) Double spendingTime,
                                        @RequestParam(value = "courtSpend", required = true) Integer courtSpend,
                                        @RequestParam(value = "coachSpend", required = true) Integer coachSpend,
                                        @RequestParam(value = "court", required = true) Integer court,
                                        @RequestParam(value = "membersObj", required = true) String membersObj

                                   ) throws AuthenticationException {

        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        LdRankInfoVo vo= rankService.getLDUserRank(userId);
        if (vo.getClubId()!= LdRankInfoVo.MASTER) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        HashMap<String,Integer> obj= JSON.parseObject(membersObj,HashMap.class);
        return new ResponseEntity<Object>(
                CommonResponse.success(courseService.addCourse(startTime, endTime,  coach,  isExperience,  isDealing,  spendingTime,
                         courtSpend,  coachSpend,  court, obj)), HttpStatus.OK);
    }


}
