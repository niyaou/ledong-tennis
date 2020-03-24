package ledong.wxapp.swagger;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.Parameter;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class Swagger2 {

    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
                .apis(RequestHandlerSelectors.basePackage("ledong.wxapp")).paths(PathSelectors.any()).build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("Pangoo DLS Interfaces").description("").version("1.0").build();
    }

    @SuppressWarnings("unused")
    private List<ApiKey> securitySchemes() {
        List<ApiKey> listApiKey = new ArrayList<ApiKey>();
        listApiKey.add(new ApiKey("Authorization", "Authorization", "header"));
        return listApiKey;
    }

    @SuppressWarnings("unused")
    private List<SecurityContext> securityContexts() {
        List<SecurityContext> list = new ArrayList<SecurityContext>();
        list.add(SecurityContext.builder().securityReferences(defaultAuth())
                .forPaths(PathSelectors.regex("^(?!auth).*$")).build());
        return list;
    }

    List<SecurityReference> defaultAuth() {
        List<SecurityReference> list = new ArrayList<SecurityReference>();
        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        list.add(new SecurityReference("Authorization", authorizationScopes));
        return list;
    }

    @SuppressWarnings("unused")
    private List<Parameter> setHeaderToken() {
        ParameterBuilder tokenPar = new ParameterBuilder();
        List<Parameter> pars = new ArrayList<>();
        tokenPar.name("access_token").description("认证token").modelRef(new ModelRef("string")).parameterType("header")
                .required(true).build();
        pars.add(tokenPar.build());
        return pars;
    }
}