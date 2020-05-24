package ledong.wxapp.config;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class MatchesScheduleTask {


    //3.添加定时任务
    @Scheduled(cron = "3 0/10 * * * ?")
    private void configureTasks() {
        System.err.println("执行静态定时任务时间: " + LocalDateTime.now());
    }


        //3.添加定时任务
        @Scheduled(cron = "3 0/2 * * * ?")
        private void configureTasks2() {
            System.err.println("每隔2分钟执行静态定时任务时间: " + LocalDateTime.now());
        }

    
}