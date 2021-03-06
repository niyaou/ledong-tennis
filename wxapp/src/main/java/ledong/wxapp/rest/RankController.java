package ledong.wxapp.rest;

import VO.LdRankInfoVo;
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
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.enums.ResultCodeEnum;
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
    public ResponseEntity<?> matchInformationExplore(@PathVariable(value = "matchId", required = true) String matchId) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.matchRank(matchId, 1, 1)), HttpStatus.OK);
    }

    @RequestMapping(value = "/rankInfo", method = RequestMethod.GET)
    @ApiOperation(value = "explore current rank information", notes = "")
    public ResponseEntity<?> userRankIformationDetail(@RequestHeader("Authorization") String authHeader) {
        Claims claims = tokenService.getClaimByToken(authHeader);
        String userId = claims.getSubject();
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getUserRank(userId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ldRankInfo", method = RequestMethod.GET)
    @ApiOperation(value = "explore current rank information", notes = "")
    public ResponseEntity<?> userLdRankIformationDetail(@RequestHeader("Authorization") String authHeader) {
        Claims claims = tokenService.getClaimByToken(authHeader);
        String userId = claims.getSubject();
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getLDUserRank(userId)), HttpStatus.OK);
    }
    @RequestMapping(value = "/rankInfo/{user}", method = RequestMethod.GET)
    @ApiOperation(value = "explore current rank information", notes = "")
    public ResponseEntity<?> userRankIformationById(@PathVariable(value = "user", required = true) String user) {
        // Claims claims = tokenService.getClaimByToken(authHeader);
        // String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getUserRank(user)), HttpStatus.OK);
    }

    @RequestMapping(value = "/rankList", method = RequestMethod.GET)
    @ApiOperation(value = "explore  ranking list ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "grade", value = "grade name", required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "count", value = "list count ", required = false, dataType = "string", paramType = "query") })
    public ResponseEntity<?> userRankingList(@RequestParam(value = "grade", required = false) String grade,
            @RequestParam(value = "count", required = false) Integer count) {
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getRankingList(count)), HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/rankList", method = RequestMethod.GET)
    @ApiOperation(value = "explore  ranking list ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "grade", value = "grade name", required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "count", value = "list count ", required = false, dataType = "string", paramType = "query") })
    public ResponseEntity<?> userLRRankingList(@RequestParam(value = "grade", required = false) String grade,
                                             @RequestParam(value = "count", required = false) Integer count) {
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getLDRankingList(count)), HttpStatus.OK);
    }


    @RequestMapping(value = "/doubleRankList", method = RequestMethod.GET)
    @ApiOperation(value = "explore  ranking list ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "grade", value = "grade name", required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "count", value = "list count ", required = false, dataType = "string", paramType = "query") })
    public ResponseEntity<?> userDoubleRankList(@RequestParam(value = "grade", required = false) String grade,
            @RequestParam(value = "count", required = false) Integer count) {
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getDoubleRankingList(grade)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/rankNewList", method = RequestMethod.GET)
    @ApiOperation(value = "explore  ranking list ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "count", value = "list count ", required = false, dataType = "string", paramType = "query") })
    public ResponseEntity<?> userRankingNewList(@RequestParam(value = "count", required = false) Integer count) {
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getRankingList(count)), HttpStatus.OK);
    }

    @RequestMapping(value = "/rankPosition", method = RequestMethod.GET)
    @ApiOperation(value = "get user position in  ranking list ", notes = "")
    public ResponseEntity<?> userRankingListPosition(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getUserPositionInRankList(userId)),
                HttpStatus.OK);
    }


    @RequestMapping(value = "/ldRankPosition", method = RequestMethod.GET)
    @ApiOperation(value = "get user position in  ranking list ", notes = "")
    public ResponseEntity<?> userLDRankingListPosition(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getLDUserPositionInRankList(userId)),
                HttpStatus.OK);
    }


    @RequestMapping(value = "/totalUser", method = RequestMethod.GET)
    @ApiOperation(value = "get user count ", notes = "")
    public ResponseEntity<?> getTotalUser(@RequestHeader("Authorization") String authHeader)
            throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {

            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getTotalUser()), HttpStatus.OK);
    }

    @RequestMapping(value = "/updateUserScore", method = RequestMethod.POST)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "score", value = "score ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "description", value = "score ", required = true, dataType = "string", paramType = "query"), })
    public ResponseEntity<?> updateUserScore(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "openId", required = true) String openId,
            @RequestParam(value = "description", required = true) String description,
            @RequestParam(value = "score", required = true) Integer score) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(
                CommonResponse.success(iRankService.updateScoreByMaster(openId, score, description)), HttpStatus.OK);
    }


    @RequestMapping(value = "/ld/updateUserScore", method = RequestMethod.POST)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "score", value = "score ", required = true, dataType = "int", paramType = "query"),
            @ApiImplicitParam(name = "description", value = "score ", required = true, dataType = "string", paramType = "query"), })
    public ResponseEntity<?> updateLDUserScore(@RequestHeader("Authorization") String authHeader,
                                             @RequestParam(value = "openId", required = true) String openId,
                                             @RequestParam(value = "description", required = true) String description,
                                             @RequestParam(value = "score", required = true) Integer score) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
//        if (!"19960390361".equals(userId) && !"18602862619".equals(userId)) {
//            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
//        }
        LdRankInfoVo vo= iRankService.getLDUserRank(userId);
        if (vo.getClubId()!=LdRankInfoVo.MASTER) {
            throw new CustomException(ResultCodeEnum.MASTER_ALLOWED_ONLY);
        }
        return new ResponseEntity<Object>(
                CommonResponse.success(iRankService.updateLDScoreByMaster(openId, score, description)), HttpStatus.OK);
    }


    @RequestMapping(value = "/scoreLog", method = RequestMethod.GET)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({            })
    public ResponseEntity<?> getScoreLog(@RequestHeader("Authorization") String authHeader
                                        ) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(
                CommonResponse.success(iRankService.getScoreLog(userId)), HttpStatus.OK);
    }


    @RequestMapping(value = "/ld/scoreLog", method = RequestMethod.GET)
    @ApiOperation(value = "updateUserScore ", notes = "")
    @ApiImplicitParams({            })
    public ResponseEntity<?> getLDScoreLog(@RequestHeader("Authorization") String authHeader
    ) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        String userId = claims.getSubject();
        return new ResponseEntity<Object>(
                CommonResponse.success(iRankService.getLDScoreLog(userId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/updateUserTags", method = RequestMethod.POST)
    @ApiOperation(value = "updateUserTags ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "tags", value = "tags ", required = true, dataType = "string", paramType = "query") })
    public ResponseEntity<?> updateUserTags(@RequestHeader("Authorization") String authHeader,
            @RequestParam(value = "openId", required = true) String openId,
            @RequestParam(value = "tags", required = true) String tags) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.updateUserTags(openId, tags)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/ld/updateUserTags", method = RequestMethod.POST)
    @ApiOperation(value = "updateUserTags ", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "openId", value = "openId", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "tags", value = "tags ", required = true, dataType = "string", paramType = "query") })
    public ResponseEntity<?> updateLDUserTags(@RequestHeader("Authorization") String authHeader,
                                            @RequestParam(value = "openId", required = true) String openId,
                                            @RequestParam(value = "tags", required = true) String tags) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.updateLDUserTags(openId, tags)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/getTags", method = RequestMethod.GET)
    @ApiOperation(value = "getTags ", notes = "")
    @ApiImplicitParams({            })
    public ResponseEntity<?> getTags(@RequestHeader("Authorization") String authHeader
          ) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getTagsList()),
                HttpStatus.OK);
    }


    @RequestMapping(value = "/ld/getTags", method = RequestMethod.GET)
    @ApiOperation(value = "getTags ", notes = "")
    @ApiImplicitParams({            })
    public ResponseEntity<?> getLDTags(@RequestHeader("Authorization") String authHeader
    ) throws AuthenticationException {
        Claims claims = tokenService.getClaimByToken(authHeader);
        if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
            throw new AuthenticationException("token 不可用");
        }
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getLDTagsList()),
                HttpStatus.OK);
    }


}
