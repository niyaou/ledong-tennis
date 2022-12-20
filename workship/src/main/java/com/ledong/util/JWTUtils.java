package com.ledong.util;

import cn.hutool.jwt.JWT;

public class JWTUtils {
   private final static byte[] key = "LEDONGTENNIS".getBytes();
    public final static String NUMBER = "NUMBER";
   public  static String encode(String number){
       return JWT.create().setPayload(NUMBER,number).setKey(key).sign();
   }

}
