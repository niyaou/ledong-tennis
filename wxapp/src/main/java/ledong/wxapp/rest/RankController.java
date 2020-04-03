package ledong.wxapp.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import VO.MatchRequestVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
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

    @RequestMapping(value = "/matchInfo/${matchId}", method = RequestMethod.GET)
    @ApiOperation(value = "explore a match information", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "matchId", value = "session  id", required = true, dataType = "string", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> matchInformationExplore(@PathVariable(value = "matchId", required = true) String matchId) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.matchRank(matchId, 1, 1)), HttpStatus.OK);
    }

    @RequestMapping(value = "/rankInfo/${userId}", method = RequestMethod.GET)
    @ApiOperation(value = "explore a user rank information", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "userId", required = true, dataType = "string", paramType = "path") })
    // @LogAnnotation(action = LogActionEnum.USER, message = "用户登出")
    public ResponseEntity<?> userRankIformationExplore(@PathVariable(value = "userId", required = true) String userId) {
        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        return new ResponseEntity<Object>(CommonResponse.success(iRankService.getUserRank(userId)), HttpStatus.OK);
    }

}
