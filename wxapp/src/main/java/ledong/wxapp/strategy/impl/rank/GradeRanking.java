package ledong.wxapp.strategy.impl.rank;



import VO.RankInfoVo;
import ledong.wxapp.constant.enums.GradeCodeEnum;
import ledong.wxapp.strategy.GradingStrategy;

public class GradeRanking extends GradingStrategy {



    @Override
    public RankInfoVo ranking(RankInfoVo user) {

        if (user.getScore() <= 2600) {
            user.setRankType0(GradeCodeEnum.BRASS.getMessage());
        } else if (user.getScore() <= 3600) {
            user.setRankType0(GradeCodeEnum.SILVER.getMessage());
        } else if (user.getScore() <= 5000) {
            user.setRankType0(GradeCodeEnum.GOLDEN.getMessage());
        } else {
            user.setRankType0(GradeCodeEnum.DIAMOND.getMessage());
        }

        user .setRankType1(winRateFilter(user.getOpenId()));
        return user;
    }

    private String winRateFilter(String userId) {

        return GradeCodeEnum.THREEPOINT.getMessage();

    }

}
