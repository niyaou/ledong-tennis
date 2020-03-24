package ledong.wxapp.entity;

import ledong.wxapp.constant.enums.ResultCodeEnum;

/**
 * 接口返回的通用响应
 * 
 * @author pengdengfu
 *
 */
public class CommonResponse {
    /** 返回码 */
    private Integer code;
    /** 返回码对应的消息 */
    private String message;
    /** 返回的数据 */
    private Object data;

    public CommonResponse() {
    }

    public CommonResponse(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public CommonResponse(Integer code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public void setResultCode(ResultCodeEnum code) {
        this.code = code.getCode();
        this.message = code.getMessage();
    }

    /**
     * 成功，只返回状态码
     * 
     * @return
     */
    public static CommonResponse success() {
        CommonResponse result = new CommonResponse();
        result.setResultCode(ResultCodeEnum.SUCCESS);
        return result;
    }

    /**
     * 成功，返回状态码和响应数据
     * 
     * @param data 响应数据
     * @return
     */
    public static CommonResponse success(Object data) {
        CommonResponse result = new CommonResponse();
        result.setResultCode(ResultCodeEnum.SUCCESS);
        result.setData(data);
        return result;
    }

    /**
     * 错误，只返回错误码
     * 
     * @param resultCode
     * @return
     */
    public static CommonResponse failure(ResultCodeEnum resultCode) {
        CommonResponse result = new CommonResponse();
        result.setResultCode(resultCode);
        return result;
    }

    /**
     * 错误，只返回错误码
     * 
     * @param resultCode
     * @param data
     * @return
     */
    public static CommonResponse failure(ResultCodeEnum resultCode, Object data) {
        CommonResponse result = new CommonResponse();
        result.setResultCode(resultCode);
        result.setData(data);
        return result;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "CommonResponse [code=" + code + ", message=" + message + ", data=" + data + "]";
    }

}
