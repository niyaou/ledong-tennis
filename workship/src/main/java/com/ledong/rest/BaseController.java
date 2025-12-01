package com.ledong.rest;

import com.ledong.exception.CustomException;
import com.ledong.exception.UseCaseCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;

public  class BaseController {
    @Value("${spring.verified}")
    private String verified;

    public void verifiedSecure(String secure) {
        // if(!StringUtils.hasText(secure)|| !secure.equals(verified)){
        //     throw  new CustomException(UseCaseCode.PERMISSION_DENIED);
        // }
    }


}
