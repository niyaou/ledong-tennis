package ledong.wxapp.rest;

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

@RequestMapping(value = "/user")
@RestController
@Api(value = "user management", tags = "UserController")
@Validated
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    private IMatchService matchService;
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
        if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(CommonResponse.success(userService.getUserList()), HttpStatus.OK);
    }
}
