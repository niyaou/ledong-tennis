package ledong.wxapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.MultipartConfigElement;

@SpringBootApplication
@EnableSwagger2
@ComponentScan(basePackages = { "ledong.wxapp" })
@EnableAsync
public class DemoApplication {


    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }



}
