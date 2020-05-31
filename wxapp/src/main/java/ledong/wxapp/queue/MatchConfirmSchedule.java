package ledong.wxapp.queue;

import java.util.concurrent.DelayQueue;

import org.springframework.stereotype.Component;


@Component
public class MatchConfirmSchedule {

    private  DelayQueue<ConfirmedMatchTask> queue = new  DelayQueue<ConfirmedMatchTask>();

    public  DelayQueue<ConfirmedMatchTask> put(String matchId) {
        ConfirmedMatchTask sendMsg = new ConfirmedMatchTask(300000, matchId);// 10秒后激活消息
        queue.offer(sendMsg);// 发送消息
        return queue;
    }

    public  DelayQueue<ConfirmedMatchTask> get() {
        return queue;
    }

}