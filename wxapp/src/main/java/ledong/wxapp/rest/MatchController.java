package ledong.wxapp.rest;

import javax.annotation.Resource;

import org.apache.http.auth.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import VO.MatchConfirmEvent;
import VO.MatchRequestVo;
import io.jsonwebtoken.Claims;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.CommonConstanst;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.constant.enums.ResultCodeEnum;
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
                        @ApiImplicitParam(name = "gps", value = "random request user's location \"latitude,longitude\"", required = true, dataType = "string", paramType = "query") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> randomMatch(@RequestHeader("Authorization") String authHeader,
                        @RequestParam(value = "gps", required = true) String gps) {
                if (gps.contains("undefined")) {
                        gps = CommonConstanst.GPS;
                }
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(CommonResponse.success(null), HttpStatus.OK);
        }

        @RequestMapping(value = "/randomDoubleMatch", method = RequestMethod.POST)
        @ApiOperation(value = "request a random double match", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "gps", value = "random request user's location \"latitude,longitude\"", required = true, dataType = "string", paramType = "query") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> randomDoubleMatch(@RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(CommonResponse.success(matchService.requestDoubleMatching(userId)),
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
                return new ResponseEntity<Object>(CommonResponse
                                .success(matchService.postIntentionalMatch(userId, orderTime, courtName, courtGPS)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/intentionalMatch/{count}", method = RequestMethod.GET)
        @ApiOperation(value = "request a intentional match", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "count", value = "intentional request count", required = true, dataType = "int", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> exploreIntentionalMatch(
                        @PathVariable(value = "count", required = true) Integer count) {
                MatchRequestVo vo = new MatchRequestVo();
                vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
                return new ResponseEntity<Object>(CommonResponse.success(matchService.getIntentionalMatch(count)),
                                HttpStatus.OK);
        }

    @RequestMapping(value = "/postMatch", method = RequestMethod.POST)
    @ApiOperation(value = "post match record", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "opponent", value = "opponent name", required = true, dataType = "string", paramType = "query") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> postMatch(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "opponent", required = true) String opponent) {
        Claims claims = tokenService.getClaimByToken(authHeader);
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(matchService.postMatches(null,userId,opponent,0,0,null,null,null)),
                HttpStatus.OK);
    }

        @RequestMapping(value = "/matchedGames/{count}", method = RequestMethod.GET)
        @ApiOperation(value = "request  matched games", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "count", value = "matched request count", required = true, dataType = "int", paramType = "path") })
        public ResponseEntity<?> exploreMatchedGames(@PathVariable(value = "count", required = true) Integer count,
                        @RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(CommonResponse.success(matchService.getMatchedList(userId, count)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/matchedGames/count", method = RequestMethod.GET)
        @ApiOperation(value = "request  matched games", notes = "")
        @ApiImplicitParams({ })
        public ResponseEntity<?> getMatchedGamesCount(
                                                     @RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(CommonResponse.success(matchService.getMatchedCount(userId)),
                        HttpStatus.OK);
        }

        @RequestMapping(value = "/matchedGames/h2h/{count}", method = RequestMethod.GET)
        @ApiOperation(value = "request  h2h matched games", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "opponent", value = "opponent name", required = true, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "count", value = "matched request count", required = true, dataType = "int", paramType = "path") })
        public ResponseEntity<?> exploreMatchedGames(@RequestParam(value = "opponent", required = true) String opponent,
                        @PathVariable(value = "count", required = true) Integer count,
                        @RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(
                                CommonResponse.success(matchService.getH2hMatchedList(userId, opponent, count)),
                                HttpStatus.OK);
        }


        @RequestMapping(value = "/matchedGames/h2h/opponent", method = RequestMethod.GET)
        @ApiOperation(value = "request  h2h matched opponent", notes = "")
        @ApiImplicitParams({
                @ApiImplicitParam(name = "opponent", value = "opponent name", required = true, dataType = "string", paramType = "query")
              })
        public ResponseEntity<?> h2hOpponentCount(   @RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(
                        CommonResponse.success(matchService.getH2hOpponentCount(userId)),
                        HttpStatus.OK);
        }



        @RequestMapping(value = "/doubleMatchedGames/{count}", method = RequestMethod.GET)
        @ApiOperation(value = "request  doubleMatched games", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "count", value = "matched request count", required = true, dataType = "int", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> exploreDoubleMatchedGames(
                        @PathVariable(value = "count", required = true) Integer count,
                        @RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(
                                CommonResponse.success(matchService.getDoubleMatchedList(userId, count)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/rankedMatch", method = RequestMethod.GET)
        @ApiOperation(value = "get current ranked match", notes = "")
        public ResponseEntity<?> exploreRankedGame(@RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(CommonResponse.success(matchService.rankedMatchInfo(userId)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/playingMatch", method = RequestMethod.GET)
        @ApiOperation(value = "get current playing match", notes = "")
        public ResponseEntity<?> explorePlayingGame(@RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(CommonResponse.success(matchService.playingMatchInfo(userId)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/matchResult", method = RequestMethod.GET)
        @ApiOperation(value = "get last match result", notes = "")
        public ResponseEntity<?> exploreLastResult(@RequestHeader("Authorization") String authHeader) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(CommonResponse.success(null), HttpStatus.OK);
        }

        @RequestMapping(value = "/matchInfo/{matchId}", method = RequestMethod.GET)
        @ApiOperation(value = "get  match infos", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched request count", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> getMatchInfos(@PathVariable(value = "matchId", required = true) String matchId) {
                return new ResponseEntity<Object>(CommonResponse.success(matchService.getMatchInfos(matchId)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/doubleMatchInfo/{matchId}", method = RequestMethod.GET)
        @ApiOperation(value = "get  match infos", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched request count", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> getDoubleMatchInfos(@PathVariable(value = "matchId", required = true) String matchId) {
                return new ResponseEntity<Object>(CommonResponse.success(matchService.getDoubleMatchInfos(matchId)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/matchInfo/{matchId}", method = RequestMethod.POST)
        @ApiOperation(value = "update  match infos", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched id", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "courtName", value = "intentional request court name", required = false, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "courtGPS", value = "intentional request court gps", required = false, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "orderTime", value = "intentional request time", required = false, dataType = "string", paramType = "query") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> updateMatchInfos(@PathVariable(value = "matchId", required = true) String matchId,
                        @RequestParam(value = "courtName", required = false) String courtName,
                        @RequestParam(value = "courtGPS", required = false) String courtGPS,
                        @RequestParam(value = "orderTime", required = false) String orderTime) {
                return new ResponseEntity<Object>(
                                CommonResponse.success(
                                                matchService.updateMatchInfos(matchId, orderTime, courtName, courtGPS)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/doubleMatchInfo/{matchId}", method = RequestMethod.POST)
        @ApiOperation(value = "update  match infos", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched id", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "courtName", value = "intentional request court name", required = false, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "courtGPS", value = "intentional request court gps", required = false, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "orderTime", value = "intentional request time", required = false, dataType = "string", paramType = "query") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> updateDoubleMatchInfos(
                        @PathVariable(value = "matchId", required = true) String matchId,
                        @RequestParam(value = "courtName", required = false) String courtName,
                        @RequestParam(value = "courtGPS", required = false) String courtGPS,
                        @RequestParam(value = "holder2", required = false) String holder2,
                        @RequestParam(value = "challenger2", required = false) String challenger2) {
                return new ResponseEntity<Object>(CommonResponse.success(matchService.updateDoubleMatchInfos(matchId,
                                courtName, courtGPS, holder2, challenger2)), HttpStatus.OK);
        }

        @RequestMapping(value = "/matchScore/{matchId}", method = RequestMethod.POST)
        @ApiOperation(value = "update  match score", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched id", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "holderScore", value = "holder score", required = false, dataType = "integer", paramType = "query"),
                        @ApiImplicitParam(name = "challengerScore", value = "challengerScore", required = false, dataType = "integer", paramType = "query") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> updateMatchScore(@PathVariable(value = "matchId", required = true) String matchId,
                        @RequestParam(value = "holderScore", required = false) Integer holderScore,
                        @RequestParam(value = "challengerScore", required = false) Integer challengerScore) {
                return new ResponseEntity<Object>(
                                CommonResponse.success(
                                                matchService.updateMatchScore(matchId, holderScore, challengerScore)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/doubleMatchScore/{matchId}", method = RequestMethod.POST)
        @ApiOperation(value = "update double match score", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched id", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "holderScore", value = "holder score", required = false, dataType = "integer", paramType = "query"),
                        @ApiImplicitParam(name = "challengerScore", value = "challengerScore", required = false, dataType = "integer", paramType = "query") })
        public ResponseEntity<?> updateDoubleMatchScore(
                        @PathVariable(value = "matchId", required = true) String matchId,
                        @RequestParam(value = "holderScore", required = false) Integer holderScore,
                        @RequestParam(value = "challengerScore", required = false) Integer challengerScore) {
                return new ResponseEntity<Object>(CommonResponse
                                .success(matchService.updateDoubleMatchScore(matchId, holderScore, challengerScore)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/matchConfirm/{matchId}/{type}", method = RequestMethod.POST)
        @ApiOperation(value = "confirm   match ", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched id ", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "type", value = "user type , 0 : holder , 1 : challenger", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> confirmMatch(@PathVariable(value = "matchId", required = true) String matchId,
                        @PathVariable(value = "type", required = true) Integer type) {
                return new ResponseEntity<Object>(CommonResponse.success(matchService.confirmMatch(matchId, type)),
                                HttpStatus.OK);

        }

        @RequestMapping(value = "/doubleMatchConfirm/{matchId}/{type}", method = RequestMethod.POST)
        @ApiOperation(value = "confirm   match ", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "matched id ", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "type", value = "user type , 0 : holder , 1 : challenger", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> confirmDoubleMatch(@PathVariable(value = "matchId", required = true) String matchId,
                        @PathVariable(value = "type", required = true) Integer type) {
                return new ResponseEntity<Object>(
                                CommonResponse.success(matchService.confirmDoubleMatch(matchId, type)), HttpStatus.OK);
        }

        @RequestMapping(value = "/intentionalMatch/{matchId}", method = RequestMethod.POST)
        @ApiOperation(value = "pick a intentional request  match", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "matchId", value = "intentional  request id", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> pickIntentionalMatch(@RequestHeader("Authorization") String authHeader,
                        @PathVariable(value = "matchId", required = true) String matchId) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String userId = claims.getSubject();
                return new ResponseEntity<Object>(
                                CommonResponse.success(matchService.acceptIntentionalMatch(matchId, userId)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/matchResult/{matchId}", method = RequestMethod.POST)
        @ApiOperation(value = "finish match ,upload score result", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "holderScore", value = "holderScore", required = true, dataType = "int", paramType = "query"),
                        @ApiImplicitParam(name = "challengerScore", value = "challengerScore", required = true, dataType = "int", paramType = "query"),
                        @ApiImplicitParam(name = "matchId", value = "  match id", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> finishMatch(@RequestHeader("Authorization") String authHeader,
                        @RequestParam(value = "holderScore", required = true) Integer holderScore,
                        @RequestParam(value = "challengerScore", required = true) Integer challengerScore,
                        @PathVariable(value = "matchId", required = true) String matchId)
                        throws AuthenticationException {
                Claims claims = tokenService.getClaimByToken(authHeader);
                if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
                        throw new AuthenticationException("token 不可用");
                }
                String userId = claims.getSubject();
                if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
                        throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
                }
                return new ResponseEntity<Object>(
                                CommonResponse.success(matchService.finishMatch(matchId, holderScore, challengerScore)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/doubleMatchResult/{matchId}", method = RequestMethod.POST)
        @ApiOperation(value = "finish match ,upload score result", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "holderScore", value = "holderScore", required = true, dataType = "int", paramType = "query"),
                        @ApiImplicitParam(name = "challengerScore", value = "challengerScore", required = true, dataType = "int", paramType = "query"),
                        @ApiImplicitParam(name = "matchId", value = "  match id", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> finishDoubleMatch(@RequestHeader("Authorization") String authHeader,
                        @RequestParam(value = "holderScore", required = true) Integer holderScore,
                        @RequestParam(value = "challengerScore", required = true) Integer challengerScore,
                        @PathVariable(value = "matchId", required = true) String matchId)
                        throws AuthenticationException {
                Claims claims = tokenService.getClaimByToken(authHeader);
                if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
                        throw new AuthenticationException("token 不可用");
                }
                String userId = claims.getSubject();
                if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
                        throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
                }
                return new ResponseEntity<Object>(
                                CommonResponse.success(
                                                matchService.finishDoubleMatch(matchId, holderScore, challengerScore)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/challengeMatch/{holder}", method = RequestMethod.POST)
        @ApiOperation(value = "challenge a player", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "holder", value = "holder who been challenged user  id", required = true, dataType = "string", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> challengeMatch(@RequestHeader("Authorization") String authHeader,
                        @PathVariable(value = "holder", required = true) String holder) {
                Claims claims = tokenService.getClaimByToken(authHeader);
                String challenger = claims.getSubject();
                return new ResponseEntity<Object>(
                                CommonResponse.success(matchService.postChallengeMatch(holder, challenger)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/sessionContext/{sessionId}/{type}", method = RequestMethod.POST)
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
                                CommonResponse.success(matchService.insertSessionContext(sessionId, context, type)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/sessionContext/{sessionId}/{seconds}", method = RequestMethod.GET)
        @ApiOperation(value = "explore a session context with seconds diviation", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "sessionId", value = "session  id", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "seconds", value = "context type, 0 : all context,  others : seconds earlier context", required = true, dataType = "int", paramType = "path") })
        // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
        public ResponseEntity<?> sessionContextExplore(
                        @PathVariable(value = "sessionId", required = true) String sessionId,
                        @PathVariable(value = "seconds", required = true) Integer seconds) {
                MatchRequestVo vo = new MatchRequestVo();
                vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
                return new ResponseEntity<Object>(
                                CommonResponse.success(matchService.getSessionContext(sessionId, seconds)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/sessionContext/{sessionId}", method = RequestMethod.GET)
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
                return new ResponseEntity<Object>(CommonResponse.success(
                                matchService.getSessionContextWithQuantity(sessionId, holderCount, challengerCount)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/court/nearby", method = RequestMethod.GET)
        @ApiOperation(value = "nearby court", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "gps", value = "gps", required = true, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "size", value = "size", required = false, dataType = "int", paramType = "query") })
        public ResponseEntity<?> nearby(@RequestParam(value = "gps", required = true) String gps,
                        @RequestParam(value = "size", required = false) Integer size) {
                if (gps.contains("undefined")) {
                        gps = CommonConstanst.GPS;
                }
                if (size == null) {
                        size = 3;
                }
                return new ResponseEntity<Object>(CommonResponse.success(matchService.nearByCourt(gps, size)),
                                HttpStatus.OK);

        }

        @RequestMapping(value = "/postSlamMatchByMaster", method = RequestMethod.POST)
        @ApiOperation(value = "post Slam Match By  Master", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "holder", value = "holder  id", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "challenger", value = "challenger id", required = true, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "courtName", value = "courtName", required = true, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "courtGPS", value = "courtGPS", required = true, dataType = "string", paramType = "query") })

        public ResponseEntity<?> postSlamMatchByMaster(@RequestHeader("Authorization") String authHeader,
                        @RequestParam(value = "holder", required = true) String holder,
                        @RequestParam(value = "challenger", required = true) String challenger,
                        @RequestParam(value = "courtName", required = true) String courtName,
                        @RequestParam(value = "courtGPS", required = true) String courtGPS)
                        throws AuthenticationException {
                Claims claims = tokenService.getClaimByToken(authHeader);
                if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
                        throw new AuthenticationException("token 不可用");
                }
                String userId = claims.getSubject();
                if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
                        throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
                }
                return new ResponseEntity<Object>(
                                CommonResponse.success(
                                                matchService.postSlamMatch(holder, courtName, challenger, courtGPS)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/postDoubleMatch", method = RequestMethod.POST)
        @ApiOperation(value = "post double Match By  Master", notes = "")
        @ApiImplicitParams({
                        @ApiImplicitParam(name = "holder", value = "holder  id", required = true, dataType = "string", paramType = "path"),
                        @ApiImplicitParam(name = "challenger", value = "challenger id", required = true, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "courtName", value = "courtName", required = false, dataType = "string", paramType = "query"),
                        @ApiImplicitParam(name = "courtGPS", value = "courtGPS", required = false, dataType = "string", paramType = "query") })
        public ResponseEntity<?> postDoubleMatchByMaster(@RequestHeader("Authorization") String authHeader,
                        @RequestParam(value = "holder", required = true) String holder,
                        @RequestParam(value = "challenger", required = true) String challenger,
                        @RequestParam(value = "courtName", required = false) String courtName,
                        @RequestParam(value = "courtGPS", required = false) String courtGPS)
                        throws AuthenticationException {
                Claims claims = tokenService.getClaimByToken(authHeader);
                if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
                        throw new AuthenticationException("token 不可用");
                }
                // String userId = claims.getSubject();
                // if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
                // throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
                // }
                String time = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
                return new ResponseEntity<Object>(
                                // CommonResponse.success(matchService.postSlamMatch(holder, courtName,
                                // challenger, courtGPS)),
                                CommonResponse.success(matchService.postDoubleMatches(null, holder, challenger, 3000,
                                                MatchStatusCodeEnum.SLAM_MATCH.getCode(), time, null, null)),
                                HttpStatus.OK);
        }

        @RequestMapping(value = "/getStartMatch", method = RequestMethod.GET)
        @ApiOperation(value = "get Slam Match By  Master", notes = "")
        // @ApiImplicitParams({
        // @ApiImplicitParam(name = "holder", value = "holder id", required = true,
        // dataType = "string", paramType = "path"),
        // @ApiImplicitParam(name = "challenger", value = "challenger id", required =
        // true, dataType = "string", paramType = "query") })

        public ResponseEntity<?> getStartMatch(@RequestHeader("Authorization") String authHeader)
                        throws AuthenticationException {
                Claims claims = tokenService.getClaimByToken(authHeader);
                if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
                        throw new AuthenticationException("token 不可用");
                }
                String userId = claims.getSubject();
                if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
                        throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
                }
                return new ResponseEntity<Object>(CommonResponse.success(matchService.getStartMatch()), HttpStatus.OK);
        }

        // @Resource
        // private ApplicationContext ctx;

        // @RequestMapping(value = "/test/put", method = RequestMethod.GET)
        // public ResponseEntity<?> test1() {
        // ctx.publishEvent(new MatchConfirmEvent(ctx, "1"));

        // return new ResponseEntity<Object>(CommonResponse.success(), HttpStatus.OK);
        // }

}
