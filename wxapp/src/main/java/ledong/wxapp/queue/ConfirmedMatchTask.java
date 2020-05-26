package ledong.wxapp.queue;

import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

public class ConfirmedMatchTask implements Delayed {

    private final long delay; //延迟时间
    private final long expire;  //到期时间
    private final String matchId;   //数据
    private final long now; //创建时间

public ConfirmedMatchTask(long delay, String matchId){
    this.delay = delay;
    this.matchId = matchId;
    expire = System.currentTimeMillis() + delay;    //到期时间 = 当前时间+延迟时间
    now = System.currentTimeMillis();
}

    @Override
    public int compareTo(Delayed o) {
        return (int) (this.getDelay(TimeUnit.MILLISECONDS) -o.getDelay(TimeUnit.MILLISECONDS));
    }

    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(this.expire - System.currentTimeMillis() , TimeUnit.MILLISECONDS);
    }
    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ConfirmedMatchTask{");
        sb.append("delay=").append(delay);
        sb.append(", expire=").append(expire);
        sb.append(", matchId='").append(matchId).append('\'');
        sb.append(", now=").append(now);
        sb.append('}');
        return sb.toString();
    }

    public String getMatchId() {
        return matchId;
    }
    
}