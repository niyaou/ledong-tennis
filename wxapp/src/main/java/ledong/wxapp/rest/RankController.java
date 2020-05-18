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
import io.jsonwebtoken.Claims;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.entity.CommonResponse;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.utils.DateUtil;

@RequestMapping(value = "/rank")
@RestController
@Api(value = "user management", tags = "RankController")
@Validated
public class RankController {

    @Autowired
    private IRankService iRankService;
    @Autowired
    private JwtToken tokenService;
    
    @RequestMapping(value = "/matchInfo/{matchId}", method = RequestMethod.GET)
    @ApiOperation(value = "explore a match information", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "matchId", value = "session  id", required = true, dataType = "string", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> matchInformationExplore(@PathVariable(value = "matchId", required = true) String matchId) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.matchRank(matchId, 1, 1)), HttpStatus.OK);
    }

    @RequestMapping(value = "/rankInfo", method = RequestMethod.GET)
    @ApiOperation(value = "explore current rank information", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> userRankIformationDetail(@RequestHeader("Authorization") String authHeader) {
        Claims claims = tokenService.getClaimByToken(authHeader);
        String userId = claims.getSubject();
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getUserRank(userId)), HttpStatus.OK);
    }


    @RequestMapping(value = "/rankInfo/{openId}", method = RequestMethod.GET)
    @ApiOperation(value = "explore current rank information", notes = "")
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> userRankIformationById(@PathVariable(value = "openId", required = true) String openId) {
        System.out.println(openId);
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getUserRank(openId)), HttpStatus.OK);
    }



    @RequestMapping(value = "/rankList", method = RequestMethod.GET)
    @ApiOperation(value = "explore  ranking list ", notes = "")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "grade", value = "grade name", required = false, dataType = "string", paramType = "query") })
    public ResponseEntity<?> userRankingList(   @RequestParam(value = "grade", required = false) String grade) {
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getRankingList(grade)), HttpStatus.OK);
    }


    @RequestMapping(value = "/rankPosition", method = RequestMethod.GET)
    @ApiOperation(value = "get user position in  ranking list ", notes = "")
    public ResponseEntity<?> userRankingListPosition(  @RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getUserPositionInRankList(userId)), HttpStatus.OK);
    }

}
