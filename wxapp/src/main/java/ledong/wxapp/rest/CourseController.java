package ledong.wxapp.rest;

import VO.LdRankInfoVo;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
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
import ledong.wxapp.service.impl.UserServiceImpl;
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
            @ApiImplicitParam(name = "court", value = "court ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "grade", value = "grade ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "descript", value = "descript ", required = false, dataType = "string", paramType = "query"),
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
                                        @RequestParam(value = "court", required = true) String court,
                                        @RequestParam(value = "grade", required = true) String grade,
                                        @RequestParam(value = "descript", required = false) String descript,
                                        @RequestParam(value = "membersObj", required = true) String membersObj

                                   ) throws AuthenticationException {

        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        LdRankInfoVo vo = rankService.getLDUserRank(userId);
        if(vo==null){
            userId = claims.getSubject();
            if (!UserServiceImpl.ADMIN_KEY_CODE.equals(userId )) {
                throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
            }
        }else{
            HashMap<String, Object> user = userService.getLDUserInfo(userId);
            if (vo.getClubId() != LdRankInfoVo.SUPER_MASTER) {
                throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
            }

        }

        HashMap<String, JSONArray> obj= JSON.parseObject(membersObj,HashMap.class);
        return new ResponseEntity<Object>(
                CommonResponse.success(courseService.addCourse(startTime, endTime,  coach,  isExperience,  isDealing,  spendingTime,
                         courtSpend,  coachSpend,  court,grade, descript, obj)), HttpStatus.OK);
    }


    @RequestMapping(value = "/ld/uploadCourse", method = RequestMethod.POST)
    @ApiOperation(value = "uploadCourse ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "startTime", value = "startTime ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "endTime", value = "endTime ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "courseId", value = "courseId ", required = true, dataType = "string", paramType = "query")
       ,
    })
    public ResponseEntity<?> uploadCourse(@RequestHeader("Authorization") String authHeader,
                                          @RequestParam(value = "startTime", required = true) String startTime,
                                          @RequestParam(value = "endTime", required = true) String endTime,
                                          @RequestParam(value = "courseId", required = true) String courseId


    ) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }

        String userId = claims.getSubject();
        LdRankInfoVo vo = rankService.getLDUserRank(userId);
        if(vo==null){
            userId = claims.getSubject();
            if (!UserServiceImpl.ADMIN_KEY_CODE.equals(userId )) {
                throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
            }
        }else{
            HashMap<String, Object> user = userService.getLDUserInfo(userId);
            if (vo.getClubId() != LdRankInfoVo.SUPER_MASTER) {
                throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
            }

        }


        return new ResponseEntity<Object>(
                CommonResponse.success(courseService.uploadCourse(startTime, endTime, courseId)), HttpStatus.OK);
    }




    @RequestMapping(value = "/ld/courseStatistic", method = RequestMethod.POST)
    @ApiOperation(value = "courseStatistic ", notes = "")
    @ApiImplicitParams({
    })
    public ResponseEntity<?> dailyStatistics(@RequestHeader("Authorization") String authHeader
    ) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        LdRankInfoVo vo = rankService.getLDUserRank(userId);
        if(vo==null){
            userId = claims.getSubject();
            if (!UserServiceImpl.ADMIN_KEY_CODE.equals(userId )) {
                throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
            }
        }else{
            HashMap<String, Object> user = userService.getLDUserInfo(userId);
            if (vo.getClubId() != LdRankInfoVo.SUPER_MASTER) {
                throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
            }

        }

        return new ResponseEntity<Object>(
                CommonResponse.success(courseService.dailyStatistics()), HttpStatus.OK);
    }

}
