package ledong.wxapp.rest;

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
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.utils.DateUtil;

@RequestMapping(value = "/match")
@RestController
@Api(value = "match management", tags = "MatchController")
@Validated
public class MatchController {
        @Autowired
        private JwtToken tokenService;
    @Autowired
    private IMatchService matchService;

    @RequestMapping(value = "/randomMatch", method = RequestMethod.POST)
    @ApiOperation(value = "request a random match", notes = "")
    @ApiImplicitParams({
          
            @ApiImplicitParam(name = "courtGPS", value = "random request user's location \"latitude,longitude\"", required = true, dataType = "string", paramType = "query") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> randomMatch(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "courtGPS", required = true) String courtGPS) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(matchService.requestMatching(userId, courtGPS)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/intentionalMatch", method = RequestMethod.POST)
    @ApiOperation(value = "request a intentional match", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "courtName", value = "intentional request court name", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "courtGPS", value = "intentional request court location \"latitude,longitude\"", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "orderTime", value = "intentional request time", required = true, dataType = "string", paramType = "query") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> postIntentionalMatch(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "courtName", required = true) String courtName,
            @RequestParam(value = "courtGPS", required = true) String courtGPS,
            @RequestParam(value = "orderTime", required = true) String orderTime) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(
                CommonResponse.success(matchService.postIntentionalMatch(userId,orderTime, courtName, courtGPS )),
                HttpStatus.OK);
    }


    @RequestMapping(value = "/intentionalMatch/{count}", method = RequestMethod.GET)
    @ApiOperation(value = "request a intentional match", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "count", value = "intentional request count", required = true, dataType = "int", paramType = "path")
            })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> exploreIntentionalMatch(@PathVariable(value = "count", required = true) Integer count) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(
                CommonResponse.success(matchService.getIntentionalMatch(count)),
                HttpStatus.OK);
    }



    @RequestMapping(value = "/intentionalMatch/${matchId}", method = RequestMethod.POST)
    @ApiOperation(value = "pick a intentional request  match", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "challenger", value = "pick random request user", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "matchId", value = "intentional  request id", required = true, dataType = "string", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> pickIntentionalMatch(
            @RequestParam(value = "challenger", required = true) String challenger,
            @PathVariable(value = "matchId", required = true) String matchId) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(
                CommonResponse.success(matchService.acceptIntentionalMatch(matchId, challenger)), HttpStatus.OK);
    }




    @RequestMapping(value = "/matchResult/${matchId}", method = RequestMethod.POST)
    @ApiOperation(value = "finish match ,upload score result", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "holderScore", value = "holderScore", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "challengerScore", value = "challengerScore", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "matchId", value = "  match id", required = true, dataType = "string", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> finishMatch(
            @RequestParam(value = "holderScore", required = true) Integer holderScore,
            @RequestParam(value = "challengerScore", required = true) Integer challengerScore,
            @PathVariable(value = "matchId", required = true) String matchId) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(
                CommonResponse.success(matchService.finishMatch(matchId, holderScore, challengerScore) ), HttpStatus.OK);
    }


    @RequestMapping(value = "/challengeMatch/${holder}", method = RequestMethod.POST)
    @ApiOperation(value = "challenge a player", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "challenger", value = "challenger uers id ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "holder", value = "holder who been challenged user  id", required = true, dataType = "string", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> challengeMatch(@RequestParam(value = "challenger", required = true) String challenger,
            @PathVariable(value = "holder", required = true) String holder) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(matchService.postChallengeMatch(holder, challenger)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/sessionContext/${sessionId}/${type}", method = RequestMethod.POST)
    @ApiOperation(value = "post a session context", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "context", value = "dialog context ", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "sessionId", value = "session  id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "type", value = "context type, 0 : holder context,  1: challenger context", required = true, dataType = "int", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> sessionContextInsert(@RequestParam(value = "context", required = true) String context,
            @PathVariable(value = "sessionId", required = true) String sessionId,
            @PathVariable(value = "type", required = true) Integer type

    ) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(
                CommonResponse.success(matchService.insertSessionContext(sessionId, context, type)), HttpStatus.OK);
    }

    @RequestMapping(value = "/sessionContext/${sessionId}/${seconds}", method = RequestMethod.GET)
    @ApiOperation(value = "explore a session context with seconds diviation", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "sessionId", value = "session  id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "seconds", value = "context type, 0 : all context,  others : seconds earlier context", required = true, dataType = "int", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> sessionContextExplore(@PathVariable(value = "sessionId", required = true) String sessionId,
            @PathVariable(value = "seconds", required = true) Integer seconds) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(matchService.getSessionContext(sessionId, seconds)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/sessionContext/${sessionId}", method = RequestMethod.GET)
    @ApiOperation(value = "explore a session context with quantity already have", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "sessionId", value = "session  id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "holderCount", value = "holder context already have quantity", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "challengerCount", value = "challenger context already have quantity", required = true, dataType = "int", paramType = "query") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> sessionContextQuanityExplore(
            @PathVariable(value = "sessionId", required = true) String sessionId,
            @RequestParam(value = "holderCount", required = true) Integer holderCount,
            @RequestParam(value = "challengerCount", required = true) Integer challengerCount) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(
                CommonResponse
                        .success(matchService.getSessionContextWithQuantity(sessionId, holderCount, challengerCount)),
                HttpStatus.OK);
    }

}
