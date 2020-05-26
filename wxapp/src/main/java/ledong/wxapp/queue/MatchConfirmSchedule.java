package ledong.wxapp.queue;

import java.util.HashMap;
import java.util.Optional;
import java.util.concurrent.DelayQueue;

import org.springframework.stereotype.Component;

@Component
public class MatchConfirmSchedule {

    private HashMap<String, DelayQueue<ConfirmedMatchTask>> queues = new HashMap<String, DelayQueue<ConfirmedMatchTask>>();

    public  DelayQueue<ConfirmedMatchTask> put(String matchId) {
        DelayQueue<ConfirmedMatchTask> queue = new DelayQueue<ConfirmedMatchTask>();
        ConfirmedMatchTask sendMsg = new ConfirmedMatchTask(5000, matchId);// 10秒后激活消息
        queue.offer(sendMsg);// 发送消息
        queues.put(matchId, queue);
        return queue;
    }

    public DelayQueue<ConfirmedMatchTask> get(String matchId) {
        return  queues.get(matchId);
    } 

    public void remove(String matchId) {
  
        DelayQueue<ConfirmedMatchTask> queue =  queues.get(matchId);

        Optional.ofNullable(queue).ifPresent( i -> {
            System.out.println(i.toString());
            i.remove(i.peek());
            System.out.println("------poll out queue---------");
        });
    }

    public void clear(String matchId) {
        DelayQueue<ConfirmedMatchTask> queue =  queues.get(matchId);
      queues.remove(queue);
      System.out.println("------clear---------"+queues.get(key));
    }
}