package com.ledong.exception;

import java.util.Objects;

public enum UseCaseCode {
    // Common
    OK("OK", "OK"),
    ERROR("ERROR", "Service error"),
    UNKNOWN("UNKNOWN", "Unknown error"),
    NOT_FOUND("NOT_FOUND", "Resource not found"),
    DUPLICATED("DUPLICATED", "Resource duplicated"),
    PARAM_ERROR("PARAM_ERROR", "Param error"),
    PERMISSION_DENIED("PARAM_ERROR", "Permission denied"),
    NAME_DUPLICATED("NAME_DUPLICATED", "name already exists"),

    // User
    USERNAME_AND_PASSWORD_NOT_MATCH("USERNAME_AND_PASSWORD_NOT_MATCH", "Username and password not match"),

    LOGIN_STATUS_TIMEOUT("LOGIN_STATUS_TIMEOUT", "User login status timeout"),

    USER_EXIST("USER_EXIST", "User already existed"),

    USER_NOT_REGISTER("USER_NOT_REGISTER", "User not register"),

    FILE_TYPE_NOT_SUPPORT("FILE_TYPE_NOT_SUPPORT", "File type not support");
    /**
     * code
     */
    private String code;

    /**
     * description
     */
    private String message;

    UseCaseCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
    public static UseCaseCode getUseCaseCode(String code) {
        for (UseCaseCode usecaseCode : UseCaseCode.values()) {
            if (Objects.equals(usecaseCode.getCode(), code)) {
                return usecaseCode;
            }
        }
        throw new IllegalArgumentException("Param val mismatch.");
    }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }
}
