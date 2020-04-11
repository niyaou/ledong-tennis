package ledong.wxapp.strategy.impl.filter;

import java.text.ParseException;

import ledong.wxapp.strategy.MatchFilter;
import ledong.wxapp.utils.DateUtil;

public class TimeFilter extends MatchFilter {

    @Override
    public boolean filtering(Object orderTime, Object nullTime) {
        try {
            String endTime = DateUtil.getDate(DateUtil.getSundayOfThisWeek(), DateUtil.FORMAT_DATE_TIME);
            String startTime = DateUtil.getDate(DateUtil.getMondayOfThisWeek(), DateUtil.FORMAT_DATE_TIME);

            if (DateUtil.compareDate((String) orderTime, startTime) < 0
                    || DateUtil.compareDate((String) orderTime, endTime) > 0) {
                return false;
            }
            return true;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return false;
    }

}
