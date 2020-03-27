package ledong.wxapp.rest;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import VO.MatchRequestVo;
import VO.UserVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.entity.CommonResponse;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.utils.DateUtil;

@RequestMapping(value = "/user")
@RestController
@Api(value = "user management", tags = "UserController")
@Validated
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    private RedisUtil redis;

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ApiOperation(value = "authority -- user register", notes = "")
    public ResponseEntity<?> register(@RequestBody @Validated UserVo user) {
        boolean info = userService.addUser(user);
        if (!info) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/validate", method = RequestMethod.GET)
    @ApiOperation(value = "认证管理-token有效认证", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> validate() {
        // Object successed = userService.tokenAuthorize(token);

        Object a = redis.get("key");
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        // redis.expire("key", 1);
        // redis.set("key", vo,10);
        redis.submitChannelMessage("key", 12, vo);
        System.out.println(redis.hasKey("key"));
        // Object a = redis;
        try {
            Thread.sleep(1200);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
       System.out.println(redis.hasKey("key"));
    //    if (null == successed) {
    //        // 认证失败
    //        return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.TOKEN_PERMSSION_ERROR),
    //                HttpStatus.OK);
    //    }
       return new ResponseEntity<Object>(CommonResponse.success(a), HttpStatus.OK);
   }
//
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ApiOperation(value = "认证管理-用户登录", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "用户账号", required = true, dataType = "string", paramType = "form"),
            @ApiImplicitParam(name = "password", value = "用户密码", required = true, dataType = "string", paramType = "form") })
    public ResponseEntity<?> register(@RequestParam(value = "userId", required = true) String userId,
            @RequestParam(value = "password", required = true) String password) {
        HashMap<String, Object> info = userService.login(userId, password);
        if (null == info) {
            return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
        } else {
            return new ResponseEntity<Object>(CommonResponse.success(info), HttpStatus.OK);
        }
    }
}
