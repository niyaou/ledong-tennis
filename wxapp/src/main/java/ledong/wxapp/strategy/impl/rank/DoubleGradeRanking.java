package ledong.wxapp.strategy.impl.rank;

import VO.RankInfoVo;
import ledong.wxapp.constant.enums.GradeCodeEnum;
import ledong.wxapp.strategy.GradingStrategy;

public class DoubleGradeRanking extends GradingStrategy {

    @Override
    public RankInfoVo ranking(RankInfoVo user) {

        if (user.getDoubleScore() <= 2600) {
            user.setDoubleRankType0(GradeCodeEnum.BRASS.getMessage());
        } else if (user.getDoubleScore() <= 3600) {
            user.setDoubleRankType0(GradeCodeEnum.SILVER.getMessage());
        } else if (user.getDoubleScore() <= 5000) {
            user.setDoubleRankType0(GradeCodeEnum.GOLDEN.getMessage());
        } else {
            user.setDoubleRankType0(GradeCodeEnum.DIAMOND.getMessage());
        }
        user.setRankType1(winRateFilter(user));
        return user;
    }

    private String winRateFilter(RankInfoVo user) {
        String grade = user.getWinRate() > 85 ? GradeCodeEnum.FOURPOINT.getMessage()
                : user.getWinRate() > 65 ? GradeCodeEnum.THREEANDHALF.getMessage()
                        : user.getWinRate() > 50 ? GradeCodeEnum.THREEPOINT.getMessage()
                                : user.getWinRate() > 35 ? GradeCodeEnum.TWOANDHALF.getMessage()
                                        : user.getWinRate() > 20 ? GradeCodeEnum.TWOPOINT.getMessage()
                                                : GradeCodeEnum.TWOPOINT.getMessage();
        return grade;

    }

}
