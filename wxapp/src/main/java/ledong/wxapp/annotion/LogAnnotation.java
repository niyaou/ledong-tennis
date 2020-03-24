package ledong.wxapp.annotion;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import ledong.wxapp.constant.enums.LogActionEnum;

/**
 * 日志注解
 * 
 * @author uidq1163
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface LogAnnotation {
    /** 操作动作 */
    LogActionEnum action();

    /** 日志内容 */
    String message() default "";
}
