package ledong.wxapp.rest;

import org.apache.http.auth.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import VO.MatchRequestVo;
import VO.UserVo;
import io.jsonwebtoken.Claims;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.entity.CommonResponse;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.ISlamService;
import ledong.wxapp.service.impl.UserServiceImpl;
import ledong.wxapp.utils.DateUtil;

@RequestMapping(value = "/slam")
@RestController
@Api(value = "slam management", tags = "SlamController")
@Validated
public class SlamController {

    @Autowired
    private IRankService iRankService;

    @Autowired
    private UserServiceImpl user;

    @Autowired
    private ISlamService iSlamService;

    @Autowired
    private JwtToken tokenService;

    @RequestMapping(value = "", method = RequestMethod.PUT)
    @ApiOperation(value = "create a slam ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "slamDate", value = "slamDate ", required = true, dataType = "string", paramType = "query") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> createSlam(@RequestParam(value = "slamDate", required = true) String slamDate) {

        return new ResponseEntity<Object>(CommonResponse.success(iSlamService.createSlam(slamDate)), HttpStatus.OK);
    }

    @RequestMapping(value = "/explore", method = RequestMethod.GET)
    @ApiOperation(value = "explore current slam information", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> exploreSlam() {
        return new ResponseEntity<Object>(CommonResponse.success(iSlamService.exploreSlams(null)), HttpStatus.OK);
    }

    @RequestMapping(value = "/{matchId}/{openId}", method = RequestMethod.POST)
    @ApiOperation(value = "participate match ", notes = "")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "matchId", value = "matchId ", required = true, dataType = "string", paramType = "path"),
        @ApiImplicitParam(name = "openId", value = "openId  ", required = true, dataType = "string", paramType = "path") })
    public ResponseEntity<?> participateMatch(@RequestHeader("Authorization") String authHeader,
    @PathVariable(value = "matchId", required = true) String matchId,
    @PathVariable(value = "openId", required = true) String openId) {
        // Claims claims = tokenService.getClaimByToken(authHeader);
        // String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(iSlamService.participateSlam(openId, matchId)), HttpStatus.OK);
    }


    
    @RequestMapping(value = "/{openId}", method = RequestMethod.POST)
    @ApiOperation(value = "test create user ", notes = "")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "openId", value = "openId  ", required = true, dataType = "string", paramType = "path") })
    public ResponseEntity<?> testcreate(
    @PathVariable(value = "openId", required = true) String openId) throws InterruptedException {
        // Claims claims = tokenService.getClaimByToken(authHeader);
        // String userId = claims.getSubject();
        UserVo u=new UserVo();
        u.setOpenId(openId);
        user. addUser(u);
        Thread.sleep(2000);
        return new ResponseEntity<Object>(CommonResponse.success(user.login(openId, "测试"+openId,
         "https://wx.qlogo.cn/mmopen/vi_32/txBevTDopuse1ibs4BZfZyN6V9vTn0E6FBBqWibLG1m1mVibw8VEmNk0gn7JT0VGp8lD8xo5LiavwlyvAmKC14RDQA/132",
         "30.509777069091797,104.06473541259766") ), HttpStatus.OK);
    }



    @RequestMapping(value = "/groups/{slamId}", method = RequestMethod.PUT)
    @ApiOperation(value = "generator slam group ", notes = "")
    @ApiImplicitParams({
    @ApiImplicitParam(name = "slamId", value = "slamId name", required = true,
    dataType = "string", paramType = "path") })
    public ResponseEntity<?> generateGroups( @PathVariable(value = "slamId",
    required = true) String slamId) {
    return new
    ResponseEntity<Object>(CommonResponse.success(iSlamService.generateGroups(slamId)),
    HttpStatus.OK);
    }

    // @RequestMapping(value = "/rankPosition", method = RequestMethod.GET)
    // @ApiOperation(value = "get user position in ranking list ", notes = "")
    // public ResponseEntity<?> userRankingListPosition(
    // @RequestHeader("Authorization") String authHeader)
    // throws AuthenticationException {
    // Claims claims = tokenService.getClaimByToken(authHeader);
    // if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
    // throw new AuthenticationException("token 不可用");
    // }
    // String userId = claims.getSubject();
    // return new
    // ResponseEntity<Object>(CommonResponse.success(iRankService.getUserPositionInRankList(userId)),
    // HttpStatus.OK);
    // }

}
