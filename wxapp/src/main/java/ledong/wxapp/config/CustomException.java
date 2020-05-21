package ledong.wxapp.config;

import ledong.wxapp.constant.enums.ResultCodeEnum;


public class CustomException extends RuntimeException {
    /**
     *
     */
    private static final long serialVersionUID = 34687843L;
    private int code;
    private String message;
    private ResultCodeEnum resultStatusEnum;

    public CustomException(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public CustomException(ResultCodeEnum resultStatusEnum) {
         this.resultStatusEnum = resultStatusEnum;

    }

    public ResultCodeEnum getResultStatusEnum() {
        return resultStatusEnum;
    }

    public void setResultStatusEnum(ResultCodeEnum resultStatusEnum) {
        this.resultStatusEnum = resultStatusEnum;
    }
    
}