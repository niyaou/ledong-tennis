package ledong.wxapp.config;

import javax.naming.AuthenticationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.entity.CommonResponse;

@RestControllerAdvice
public class CommonExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public Object AuthorizationExceptionHandler(AuthenticationException ex) {
        return new ResponseEntity<Object>(CommonResponse.failure(ResultCodeEnum.USER_LOGIN_ERROR), HttpStatus.OK);
    }

}