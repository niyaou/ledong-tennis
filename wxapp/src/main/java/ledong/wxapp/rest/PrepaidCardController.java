package ledong.wxapp.rest;

import VO.LdRankInfoVo;
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
        LdRankInfoVo vo= rankService.getLDUserRank(userId);
        if (vo.getClubId()!= LdRankInfoVo.MASTER) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(
                CommonResponse.success(prepaidCardService.addCard(name, openId)), HttpStatus.OK);
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
        LdRankInfoVo vo= rankService.getLDUserRank(userId);
        if (vo.getClubId()!= LdRankInfoVo.MASTER) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(
                CommonResponse.success(prepaidCardService.assignMember(name, openId)), HttpStatus.OK);
    }

}
