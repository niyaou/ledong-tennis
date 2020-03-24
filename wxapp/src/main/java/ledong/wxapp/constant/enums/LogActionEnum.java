package ledong.wxapp.constant.enums;

/**
 * 日志操作类型枚举
 * 
 * @author
 *
 */
public enum LogActionEnum {
    /** 文件管理 */
    FILE(1),
    /** 权限管理 */
    SHIRO(2),
    /** 通知管理 */
    NOTICE(3),
    /** 用户管理 */
    USER(4),
    /** 标签管理 */
    TAG(5),
    /** 角色管理 */
    ROLE(6),
    /** 设备管理 */
    DEVICE(7),
    /** 设备类型管理 */
    DEVICE_TYPE(8),
    /** 产品管理 */
    PRODUCT(9),
    /** 产品管理 */
    SUB_SYSTEM(10),
    /** 清洗策略 */
    CLEAN_STRATEGY(11),
    /** 清洗算法 */
    CLEAR_ALGORITHM(12),
    /** 数据字典 */
    DATA_DICTIONARY(13),
    /** 组管理 */
    SYS_GROUP(14),
    /** 任务分配策略 */
    TASK_ASSIGN_STRATEGY(15),
    /** 标注管理 */
    LABEL(16),
    /** 运行环境配置 */
    ENV_CONFIG(17),
    /** docker镜像 */
    DOCKER_IMAGES(18),
    /** 算法机器资源 */
    ALG_MACHINE(19);

    int value;

    LogActionEnum(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
