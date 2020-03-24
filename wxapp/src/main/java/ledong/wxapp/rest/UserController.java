package ledong.wxapp.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import VO.UserVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import ledong.wxapp.annotion.LogAnnotation;
import ledong.wxapp.constant.enums.LogActionEnum;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.entity.CommonResponse;

@RequestMapping(value = "/user")
@RestController
@Api(value = "user management", tags = "UserController")
public class UserController {

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ApiOperation(value = "authority -- user login", notes = "")

    @LogAnnotation(action = LogActionEnum.USER, message = "用户登录")
    public ResponseEntity<?> login(@RequestBody UserVo user) {
//        Object info = userService.login(userId, password, request);
        Object info = null;
        if (null == info) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        }
    }

//    @RequestMapping(value = "/validate", method = RequestMethod.GET)
//    @ApiOperation(value = "认证管理-token有效认证", notes = "")
//    @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
//    public ResponseEntity<?> validate(@RequestHeader("access_token") String token) {
//        Object successed = userService.tokenAuthorize(token);
//        if (null == successed) {
//            // 认证失败
//            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.TOKEN_PERMSSION_ERROR),
//                    HttpStatus.OK);
//        }
//        return new ResponseEntity<Object>(CommonResponse.success(successed), HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/login", method = RequestMethod.POST)
//    @ApiOperation(value = "认证管理-用户登录", notes = "")
//    @ApiImplicitParams({
//            @ApiImplicitParam(name = "userId", value = "用户账号", required = true, dataType = "string", paramType = "form"),
//            @ApiImplicitParam(name = "password", value = "用户密码", required = true, dataType = "string", paramType = "form") })
//    @LogAnnotation(action = LogActionEnum.USER, message = "用户登录")
//    public ResponseEntity<?> register(@RequestParam(value = "userId", required = true) String userId,
//            @RequestParam(value = "password", required = true) String password, HttpServletRequest request) {
//        Object info = userService.login(userId, password, request);
//        if (null == info) {
//            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
//        } else {
//            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
//        }
//    }
}
