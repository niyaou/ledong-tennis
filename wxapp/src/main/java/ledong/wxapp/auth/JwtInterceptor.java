package ledong.wxapp.auth;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


//JwtInterceptor实现了拦截器的其中一个功能，但是它需要一些基础配置，写在了interceptorconfig里
@Component//扔进容器
//拦截器负责解析token,放行所有
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtToken jwtUtil;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        System.out.println("经过了拦截器:"+request.getRequestURI().toString());
        //无论如何都放行，具体能不能操作还是在具体的操作中去判断
        //拦截器只是负责把请求头中包含token的令牌进行一个解析验证
        String header=request.getHeader("Authorization");
        if(header!=null && !"".equals(header)){
            //如果有包含有Authorization头信息，就对其进行解析
            if(header.startsWith("Bearer ")){
                //得到token
                String token =header.substring(7);//从第7位网后截
                //对令牌进行验证
                try {
                    Claims claims=jwtUtil.getClaimByToken(header);//在生成token的时候本身就是将角色作为关键字生成的

                    if (claims == null || JwtToken.isTokenExpired(claims.getExpiration())) {
                        throw new AuthenticationException("token 不可用");
                    }
                    String userId = claims.getSubject();



               
                    // if(roles!=null&&roles.equals("admin")){//用户不存在或者角色不是admin
                    //     request.setAttribute("claims_admin",token);
                    // }
                    // if(roles!=null&&roles.equals("user")){
                    //     request.setAttribute("claims_user",token);
                    // }

                    request.setAttribute("user",userId);
                } catch (Exception e) {
                    throw new AuthenticationException("令牌不正确");
                }
            }

        }

        return true;//return true放行，return false不让往下走
    }

	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		
	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3)
			throws Exception {
		
	}
}