package ledong.wxapp.rest;

import ledong.wxapp.service.IRankService;
import org.apache.http.auth.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.apache.log4j.Logger;
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
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.service.IUserService;
import org.springframework.web.multipart.MultipartFile;

import VO.LdRankInfoVo;

@RequestMapping(value = "/user")
@RestController
@Api(value = "user management", tags = "UserController")
@Validated
public class UserController {
    private static Logger logger = Logger.getLogger(UserController.class);
    @Autowired
    private IUserService userService;
    @Autowired
    private IRankService rankService;
    // @Autowired
    // private RedisUtil redis;
    @Autowired
    private JwtToken tokenService;

    @RequestMapping(value = "/userinfo", method = RequestMethod.GET)
    @ApiOperation(value = "认证管理-token有效认证", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> getuserInfo(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {

        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        // 根据用户id获取接口数据返回接口
        return new ResponseEntity<Object>(CommonResponse.success(userService.getUserInfo(userId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/createTeenage", method = RequestMethod.POST)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "name", value = "score ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "avator", value = "score ", required = true, dataType = "string", paramType = "query"), })
    public ResponseEntity<?> createLDTeenage(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "openId", required = true) String openId,
            @RequestParam(value = "name", required = true) String name,
            @RequestParam(value = "avator", required = true) String avator) throws AuthenticationException {
        logger.info(authHeader + openId + name + avator);
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        logger.info(userId);
        return new ResponseEntity<Object>(
                CommonResponse.success(userService.addLDTeenageUser(userId, openId, name, avator)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/ldUsersByName", method = RequestMethod.GET)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "name", value = "score ", required = true, dataType = "int", paramType = "query") })
    public ResponseEntity<?> getLDUsersByName(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "name", required = true) String name) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(userService.getLDUsersByName(name)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/ldUsersByType", method = RequestMethod.GET)
    @ApiOperation(value = "getLDUsersByType ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "type ", required = true, dataType = "int", paramType = "query") })
    public ResponseEntity<?> getLDUsersByType(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "type", required = true) Integer type) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(userService.getLDUsersByType(type)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/verifiedMember", method = RequestMethod.POST)
    @ApiOperation(value = "verifiedMember ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "query") })
    public ResponseEntity<?> verifiedMember(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "openId", required = true) String openId) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(rankService.verifiedMember(openId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/updateTeenageParent", method = RequestMethod.POST)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "name", value = "score ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "avator", value = "score ", required = true, dataType = "string", paramType = "query"), })
    public ResponseEntity<?> updateTeenageParent(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "openId", required = true) String openId,
            @RequestParam(value = "name", required = true) String name,
            @RequestParam(value = "avator", required = true) String avator) throws AuthenticationException {
        logger.info(authHeader + openId + name + avator);
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            logger.info("----token 不可用----");
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        logger.info(userId);
        return new ResponseEntity<Object>(
                CommonResponse.success(rankService.updateTeenageParent(userId, openId, name, avator)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/exploreTeenage", method = RequestMethod.GET)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({})
    public ResponseEntity<?> exploreLDTeenage(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        return new ResponseEntity<Object>(CommonResponse.success(userService.exploreLDTeenageUser()), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/teenage/avator", method = RequestMethod.POST)
    @ApiOperation(value = "updateUserScore ", notes = "")
    public ResponseEntity<?> updateTeenageAvator(@RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile files[]) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        return new ResponseEntity<Object>(CommonResponse.success(userService.updateTeenageAvator(files)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/ldUserinfo", method = RequestMethod.GET)
    @ApiOperation(value = "认证管理-token有效认证", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> getLDUserInfo(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {

        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        // 根据用户id获取接口数据返回接口
        return new ResponseEntity<Object>(CommonResponse.success(userService.getLDUserInfo(userId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ApiOperation(value = "认证管理-用户登录", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "token", value = "token", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "nickName", value = "nickName", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "avator", value = "avator", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "gps", value = "gps", required = true, dataType = "string", paramType = "form") })
    public ResponseEntity<?> register(@RequestParam(value = "token", required = true) String token,
            @RequestParam(value = "nickName", required = true) String nickName,
            @RequestParam(value = "avator", required = true) String avator,
            @RequestParam(value = "gps", required = true) String gps) {
        if (gps.contains("undefined")) {
            gps = CommonConstanst.GPS;
        }
        String info = userService.accessByWxToken(token, nickName, avator, gps);
        if (null == info) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/ldLogin", method = RequestMethod.POST)
    @ApiOperation(value = "认证管理-用户登录", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "token", value = "token", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "nickName", value = "nickName", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "avator", value = "avator", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "gps", value = "gps", required = true, dataType = "string", paramType = "form") })
    public ResponseEntity<?> registerLD(@RequestParam(value = "token", required = true) String token,
            @RequestParam(value = "nickName", required = true) String nickName,
            @RequestParam(value = "avator", required = true) String avator,
            @RequestParam(value = "gps", required = true) String gps) {
        if (gps.contains("undefined")) {
            gps = CommonConstanst.GPS;
        }
        String info = userService.accessByLDWxToken(token, nickName, avator, gps);
        if (null == info) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/ldRealName", method = RequestMethod.POST)
    @ApiOperation(value = "用户管理--设置本名", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "realName", value = "realName", required = true, dataType = "string", paramType = "form") })
    public ResponseEntity<?> ldRealName(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "openId", required = true) String openId,
            @RequestParam(value = "realName", required = true) String realName) {
        Claims claims = tokenService.getClaimByToken(authHeader);
        String userId = claims.getSubject();
        LdRankInfoVo vo = rankService.getLDUserRank(userId);
        if (vo.getClubId() != LdRankInfoVo.MASTER && vo.getClubId() != LdRankInfoVo.SUPER_MASTER) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(CommonResponse.success(userService.ldRealName(openId, realName)),
                HttpStatus.OK);

    }

    @RequestMapping(value = "/phone", method = RequestMethod.POST)
    @ApiOperation(value = "认证管理-用户登录", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "vscode", value = "vscode", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "iv", value = "iv", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "data", value = "data", required = true, dataType = "string", paramType = "form")

    })
    public ResponseEntity<?> phone(@RequestParam(value = "vscode", required = true) String vscode,
            @RequestParam(value = "iv", required = true) String iv,
            @RequestParam(value = "data", required = true) String data) {
        try {
            String info = userService.getPhoneNumber(vscode, iv, data);
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        }

    }

    @RequestMapping(value = "/verified", method = RequestMethod.POST)
    @ApiOperation(value = "认证管理-微信认证", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "token", value = "token", required = true, dataType = "string", paramType = "form") })
    public ResponseEntity<?> verified(@RequestParam(value = "token", required = true) String token) {
        String info = userService.verified(token);
        if (null == info) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/ldVerified", method = RequestMethod.POST)
    @ApiOperation(value = "认证管理-微信认证", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "token", value = "token", required = true, dataType = "string", paramType = "form") })
    public ResponseEntity<?> ldVerified(@RequestParam(value = "token", required = true) String token) {
        String info = userService.ldVerified(token);
        if (null == info) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/nearby", method = RequestMethod.GET)
    @ApiOperation(value = "用户管理-附近用户", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "gps", value = "gps", required = true, dataType = "string", paramType = "form") })
    public ResponseEntity<?> nearby(@RequestParam(value = "gps", required = true) String gps) {
        if (gps.contains("undefined")) {
            gps = CommonConstanst.GPS;
        }
        return new ResponseEntity<Object>(CommonResponse.success(userService.getNearyByUser(gps)), HttpStatus.OK);

    }

    @RequestMapping(value = "/userList", method = RequestMethod.GET)
    @ApiOperation(value = "获取所有用户列表", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> getuserList(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(userService.getUserList()), HttpStatus.OK);
    }

    @RequestMapping(value = "/ldUserList", method = RequestMethod.GET)
    @ApiOperation(value = "获取所有用户列表", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> getldUserList(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(userService.getLDUserList()), HttpStatus.OK);
    }
}
