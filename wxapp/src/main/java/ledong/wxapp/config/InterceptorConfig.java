package ledong.wxapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import ledong.wxapp.auth.JwtInterceptor;

@Component
@Configuration
public class InterceptorConfig extends WebMvcConfigurationSupport {
    @Autowired
    private JwtInterceptor jwtInterceptor;
    @Value("${file.upload.url}")
    private String uploadFilePath;
    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor).addPathPatterns("/**").excludePathPatterns("/user/login")
                .excludePathPatterns("/user/register")
                .excludePathPatterns("/swagger-resources/**", "/webjars/**", "/v2/**", "/swagger-ui.html/**","/slam/**");

    }

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
        registry.addResourceHandler("/teenage/**").addResourceLocations("file:"+uploadFilePath);

    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowedMethods("POST", "GET", "PUT", "OPTIONS", "DELETE")
                .maxAge(3600).allowCredentials(true);
    }
}