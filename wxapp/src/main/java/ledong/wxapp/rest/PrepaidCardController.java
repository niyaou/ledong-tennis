package ledong.wxapp.rest;

import VO.LdRankInfoVo;
import VO.UserVo;
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
import ledong.wxapp.service.IPrepaidCardService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;

import java.util.HashMap;

import ledong.wxapp.service.impl.UserServiceImpl;
import org.apache.http.auth.AuthenticationException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping(value = "/prepaidCard")
@RestController
@Api(value = "prepaid card management", tags = "PrepaidCardController")
@Validated
public class PrepaidCardController {
    private static Logger logger = Logger.getLogger(PrepaidCardController.class);
    @Autowired
    private IUserService userService;
    @Autowired
    private IRankService rankService;
    @Autowired
    private IPrepaidCardService prepaidCardService;
    // @Autowired
    // private RedisUtil redis;
    @Autowired
    private JwtToken tokenService;

    @RequestMapping(value = "/ld/createCard", method = RequestMethod.POST)
    @ApiOperation(value = "createCard ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "name", value = "name ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "openId", value = "openId ", required = false, dataType = "string", paramType = "query"), })
    public ResponseEntity<?> createCard(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "name", required = true) String name,
            @RequestParam(value = "openId", required = true) String openId) throws AuthenticationException {

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

        return new ResponseEntity<Object>(CommonResponse.success(prepaidCardService.addCard(name, openId)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/assignMember", method = RequestMethod.POST)
    @ApiOperation(value = "assignMember ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "name", value = "name ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "openId", value = "openId ", required = false, dataType = "string", paramType = "query"), })
    public ResponseEntity<?> assignMember(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "name", required = true) String name,
            @RequestParam(value = "openId", required = true) String openId) throws AuthenticationException {

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

        return new ResponseEntity<Object>(CommonResponse.success(prepaidCardService.assignMember(name, openId)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/chargeAnnotation", method = RequestMethod.POST)
    @ApiOperation(value = "chargeAnnotation ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "cardId", value = "cardId ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "openId", value = "openId ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "time", value = "time ", required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "amount", value = "amount ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "times", value = "times ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "coachId", value = "coachId ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "courseId", value = "courseId ", required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "description", value = "description ", required = false, dataType = "string", paramType = "query"), })
    public ResponseEntity<?> chargeAnnotation(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "cardId", required = true) String cardId,
            @RequestParam(value = "openId", required = true) String openId,
            @RequestParam(value = "time", required = false) String time,
            @RequestParam(value = "amount", required = true) Integer amount,
                                              @RequestParam(value = "times", required = true) Integer times,
            @RequestParam(value = "coachId", required = true) String coachId,
            @RequestParam(value = "courseId", required = false) String courseId,
            @RequestParam(value = "description", required = false) String description) throws AuthenticationException {

        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        LdRankInfoVo vo = rankService.getLDUserRank(userId);
        Object temp;
        String temp_s="";
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
            temp=   user.get(UserVo.REALNAME);
            temp_s =temp.toString();

        }

        return new ResponseEntity<Object>(
                CommonResponse.success(prepaidCardService.chargeAnnotation(cardId, openId,
                        temp_s, time, amount,times, coachId, courseId, description)),
                HttpStatus.OK);
    }




    @RequestMapping(value = "/ld/updateExpireTime", method = RequestMethod.POST)
    @ApiOperation(value = "updateExpireTime ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "cardId", value = "cardId ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "time", value = "time ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "rest", value = "rest ", required = true, dataType = "int", paramType = "query")
          })
    public ResponseEntity<?> updateExpireTime(@RequestHeader("Authorization") String authHeader,
                                              @RequestParam(value = "cardId", required = true) String cardId,
                                              @RequestParam(value = "time", required = true) String time, @RequestParam(value = "rest", required = true) Integer rest) throws AuthenticationException {

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
                CommonResponse.success(prepaidCardService.setExpiredTime(cardId,time,rest)),
                HttpStatus.OK);
    }







    @RequestMapping(value = "/ld/finacialLogs", method = RequestMethod.GET)
    @ApiOperation(value = "finacialLogs ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "cardId", value = "cardId ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "startTime", value = "startTime ", required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "endTime", value = "endTime ", required = false, dataType = "string", paramType = "query") })
    public ResponseEntity<?> finacialLogs(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "cardId", required = true) String cardId,
            @RequestParam(value = "startTime", required = false) String startTime,
            @RequestParam(value = "endTime", required = false) String endTime) throws AuthenticationException {

        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        return new ResponseEntity<Object>(
                CommonResponse.success(prepaidCardService.finacialLogs(cardId, startTime, endTime)), HttpStatus.OK);
    }


    @RequestMapping(value = "/ld/chargeLogRetreat", method = RequestMethod.POST)
    @ApiOperation(value = "chargeLogRetreat ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "cardId", value = "cardId ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "time", value = "time ", required = true, dataType = "string", paramType = "query"),
        })
    public ResponseEntity<?> chargeLogRetreat(@RequestHeader("Authorization") String authHeader,
                                          @RequestParam(value = "cardId", required = true) String cardId,
                                          @RequestParam(value = "time", required = true) String time) throws AuthenticationException {

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
                CommonResponse.success(prepaidCardService.chargeLogRetreat(cardId, time)), HttpStatus.OK);
    }



    @RequestMapping(value = "/ld/recentCourse", method = RequestMethod.GET)
    @ApiOperation(value = "recentCourse ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "page", value = "page ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "num", value = "num ", required = true, dataType = "int", paramType = "query"),
    })
    public ResponseEntity<?> recentCourse(@RequestHeader("Authorization") String authHeader,
                                              @RequestParam(value = "page", required = true) Integer page,
                                              @RequestParam(value = "num", required = true) Integer num) throws AuthenticationException {

        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String keycode = claims.getSubject();

        if (!UserServiceImpl.ADMIN_KEY_CODE.equals(keycode )) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(
                CommonResponse.success(prepaidCardService.recentCourse(page, num)), HttpStatus.OK);
    }

}
