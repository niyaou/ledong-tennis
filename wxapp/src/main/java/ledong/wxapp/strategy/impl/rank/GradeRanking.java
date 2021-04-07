package ledong.wxapp.strategy.impl.rank;

import VO.LdRankInfoVo;
import VO.RankInfoVo;
import ledong.wxapp.constant.enums.GradeCodeEnum;
import ledong.wxapp.strategy.GradingStrategy;

public class GradeRanking extends GradingStrategy {

    @Override
    public RankInfoVo ranking(RankInfoVo user) {

        if (user.getScore() <= 400) {
            user.setRankType0(GradeCodeEnum.BRASS.getMessage());
        } else if (user.getScore() <= 1000) {
            user.setRankType0(GradeCodeEnum.SILVER.getMessage());
        } else if (user.getScore() <= 1600) {
            user.setRankType0(GradeCodeEnum.GOLDEN.getMessage());
        } else  if (user.getScore() <= 3000){
            user.setRankType0(GradeCodeEnum.DIAMOND.getMessage());
        }else{
            user.setRankType0(GradeCodeEnum.MASTER.getMessage());
        }
        user.setRankType1(winRateFilter(user));

        return user;
    }

    @Override
    public LdRankInfoVo ldRanking(LdRankInfoVo user) {
        if (user.getScore() <= 400) {
            user.setRankType0(GradeCodeEnum.BRASS.getMessage());
        } else if (user.getScore() <= 1000) {
            user.setRankType0(GradeCodeEnum.SILVER.getMessage());
        } else if (user.getScore() <= 1600) {
            user.setRankType0(GradeCodeEnum.GOLDEN.getMessage());
        } else  if (user.getScore() <= 3000){
            user.setRankType0(GradeCodeEnum.DIAMOND.getMessage());
        }else{
            user.setRankType0(GradeCodeEnum.MASTER.getMessage());
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
