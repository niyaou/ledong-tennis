package com.ledong.exception;

import java.io.Serial;

public class CustomException extends RuntimeException{

    @Serial
    private static final long serialVersionUID = 3L;
    private final UseCaseCode code;

    public CustomException(UseCaseCode code) {
        super(code.getMessage());
        this.code = code;
    }


    public CustomException(UseCaseCode code, String message) {
        super(message);
        this.code = code;
    }
    public CustomException(String message) {
        this(UseCaseCode.UNKNOWN, message);
    }

    public UseCaseCode getCode() {
        return code;
    }
}
