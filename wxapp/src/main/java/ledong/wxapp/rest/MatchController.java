package ledong.wxapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import VO.MatchRequestVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import ledong.wxapp.entity.CommonResponse;
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.utils.DateUtil;

@RequestMapping(value = "/match")
@RestController
@Api(value = "match management", tags = "MatchController")
@Validated
public class MatchController {

    @Autowired
    private IUserService userService;
    @Autowired
    private IMatchService matchService;

    @RequestMapping(value = "/randomMatch", method = RequestMethod.POST)
    @ApiOperation(value = "request a random match", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "random request user", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "courtGPS", value = "random request user's location", required = true, dataType = "string", paramType = "query") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> randomMatch(@RequestParam(value = "userId", required = true) String userId,
            @RequestParam(value = "userId", required = true) String courtGPS) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(matchService.requestMatching(userId, courtGPS)),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/intentionalMatch", method = RequestMethod.POST)
    @ApiOperation(value = "request a intentional match", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "intentional request user", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "courtName", value = "intentional request court name", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "courtGPS", value = "intentional request court location", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "orderTime", value = "intentional request time", required = true, dataType = "string", paramType = "query") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> postIntentionalMatch(@RequestParam(value = "userId", required = true) String userId,
            @RequestParam(value = "userId", required = true) String courtName,
            @RequestParam(value = "userId", required = true) String courtGPS,
            @RequestParam(value = "userId", required = true) String orderTime) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
//        return new ResponseEntity<Object>(CommonResponse.success(matchService.requestMatching(userId, courtGPS)),
//                HttpStatus.OK);
        return null;
    }

    @RequestMapping(value = "/intentionalMatch/${matchId}", method = RequestMethod.POST)
    @ApiOperation(value = "pick a intentional request  match", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "pick random request user", required = true, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "matchId", value = "intentional  request id", required = true, dataType = "string", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> pickIntentionalMatch(@RequestParam(value = "userId", required = true) String userId,
            @PathVariable(value = "matchId", required = true) String matchId) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
//        return new ResponseEntity<Object>(CommonResponse.success(matchService.requestMatching(userId, courtGPS)),
//                HttpStatus.OK);
        return null;
    }

}
