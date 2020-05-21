package ledong.wxapp.constant.enums;

/**
 * 响应码
 * 
 * @author pengdengfu
 *
 */
public enum ResultCodeEnum {

    /** 成功状态码 */
    SUCCESS(0, "成功"),

    /** 参数错误：10001-19999 */
    PARAM_IS_INVALID(10001, "参数无效"),
    /** 参数为空 */
    PARAM_IS_BLANK(10002, "参数为空"),
    /** 参数类型错误 */
    PARAM_TYPE_BIND_ERROR(10003, "参数类型错误"),
    /** 参数缺失 */
    PARAM_NOT_COMPLETE(10004, "参数缺失"),
    /** token认证失败 */
    TOKEN_PERMSSION_ERROR(10005, "token认证失败"),


 
    /** 数据错误：50001-599999 */
    /** 数据未找到 */
    DATA_NOT_FOUND(50001, "数据未找到"),
    /** 数据有误 */
    DATA_IS_WRONG(50002, "数据有误"),
    /** 数据已存在 */
    DATA_ALREADY_EXISTED(50003, "数据已存在"),
    /** 上级数据不存在 */
    PARENT_DATA_NOT_EXISTED(50004, "上级数据不存在"),
    /** 插入数据失败 */
    INSERT_DATA_FAILD(50005, "插入数据失败"),
    /** 更新数据失败 */
    UPSERT_DATA_FAILD(50006, "更新数据失败"),
    /** 删除数据失败 */
    DELETE_DATA_FAILD(50007, "删除数据失败"),
    /** 更新文件失败 */
    UPDATE_FILE_FAILD(50008, "更新文件失败"),
    /** 创建文件失败 */
    CREATE_FILE_FAILD(50009, "创建文件失败"),
    /** 删除文件失败 */
    DELETE_FILE_FAILD(50010, "删除文件失败"),
    /** 数据长度超过最大限制 */
    DATA_TOO_LONG(50011, "数据长度超过最大长度限制"),
    /** 文件夹不为空 */
    FOLDER_NOT_EMPTY(50012, "文件夹不为空"),

    /** 删除状态的相同数据已经存在 */
    DATA_DELETED_HAS_EXISTED(50013, "删除状态的相同数据已经存在"),


    /** 连接超时 */
    ES_TIMEOUT(50030, "连接超时"),
    /** 文件大小参数错误 */
    FILE_SIZE_PARSE_ERROR(50031, "文件大小参数错误"),
    /** 文件分块参数错误 */
    FILE_CHUNKS__ERROR(50032, "文件分块参数错误"),
    /** 文件已审核 */
    FILE_ALREADY_VERIFIED(50033, "文件已审核"),
    /** 文件审核参数错误 */
    AUDIT_STATUS_PARSE_ERROR(50034, "文件审核参数错误 "),

    /** 分页参数错误 */
    PAGEABLE_PARMAS_PARSE_ERROR(50053, "分页参数错误 "),
    /** 文件id不为空 */
    FILEID_NOT_EMPTY(50055, "文件id不为空"),
    /** 文件名不能为空 */
    FILENAME_NOT_EMPTY(50155, "文件名不能为空"),
    /** 设备名或id名不能为空 */
    DEVICE_NOT_EMPTY(50255, "设备名或id名不能为空"),
    /** 文件必须包含后缀名 */
    PREFIX_NOT_EMPTY(50156, "文件必须包含后缀名 "),
    /** 文件基本信息参数错误 */
    FILE_PARAMS_ERROR(50056, "文件基本信息参数错误"),
    /** 文件类型信息参数错误 */
    FILE_TYPE_ERROR(52056, "文件类型信息参数错误"),
    /** 时间信息参数错误 */
    DATE_PARAMS_ERROR(51056, "时间信息参数错误"),
    /** 格式化参数解析错误 */
    FILE_PARAMS_PARSE_ERROR(50356, "格式化参数解析错误"),
    /** 文件正在修改 */
    FILE_ALREADY_EDITED(50057, "文件正在修改"),
    /** minSize必须小于等于maxSize */
    MAXSIZE_MUST_ABOVE_MINSIZE(50058, "minSize必须小于等于maxSize"),
    /** startTime必须小于等于endTime */
    STARTTIME_MUST_BEFORE_ENDTIME(50059, "startTime必须小于等于endTime"),
    /** 需要列出时间范围 */
    TIMERANGE_MUST_EXISTED(50061, "需要列出时间范围"),
    /** 需要列出大小范围 */
    SIZERANGE_MUST_EXISTED(50060, "需要列出大小范围"),
    /** 文件审核信息不能为空 */
    AUDIT_MESSAGE_MUST_NOT_BLANK(50063, "文件审核信息不能为空  "),
    /** chunks不能为空 */
    CHUNKS_NOT_EMPTY(50064, "chunks不能为空 "),
    /** current不能为空 */
    CURRENT_NOT_EMPTY(50065, "current不能为空 "),
    /** 文件上传失败 */
    UPLOAD_FILE_FAILED(50066, "文件上传失败 "),
    /** size不能为空 */
    SIZE_NOT_EMPTY(50067, "size不能为空 "),
    /** 接口错误：60001-69999 */
    INTERFACE_INNER_INVOKE_ERROR(60001, "内部系统接口调用异常"),
    /** 外部系统接口调用异常9 */
    INTERFACE_OUTTER_INVOKE_ERROR(60002, "外部系统接口调用异常"),
    /** 该接口禁止访问 */
    INTERFACE_FORBID_VISIT(60003, "该接口禁止访问"),
    /** 接口地址无效 */
    INTERFACE_ADDRESS_INVALID(60004, "接口地址无效"),
    /** 接口请求超时 */
    INTERFACE_REQUEST_TIMEOUT(60005, "接口请求超时"),
    /** 接口负载过高 */
    INTERFACE_EXCEED_LOAD(60006, "接口负载过高"),

    /** 权限错误：70001-79999 */
    PERMISSION_NO_ACCESS(70001, "无访问权限"),
    USER_LOGIN_ERROR(10010,"登录失败"),
    /** 数据更新错误：80001-89999 */
    /** 数据已经被其他用户更新,请刷新重试 */
    OTHER_USER_UPDATED(80001, "数据已经被其他用户更新,请刷新重试"),
    /** 相同的名称已经存在 */
    SAME_NAME_EXISTED(82001, "相同的名称已经存在"),
    /** 指定Id的数据不存在 */
    SPECIFIED_DATA_NOT_EXISTED(82003, "指定Id的数据不存在"),
    /** 拥有标注任务未完成,不能删除! */
    TASK_NOT_FINISHED(82004, "拥有标注任务未完成,不能删除!"),



    ONLY_ONE_INTENTIONAL_MATCH(91001,"只能发布一个比赛"),

    ALREADY_ACCEPTED_MATCH(91002,"已经匹配过该场比赛"),

    /** 未知错误 */
    UNKOWN_ERROR(90001, "未知错误");

    private Integer code;

    private String message;

    ResultCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return this.code;
    }

    public String getMessage() {
        return this.message;
    }

    public static String getMessage(String name) {
        for (ResultCodeEnum item : ResultCodeEnum.values()) {
            if (item.name().equals(name)) {
                return item.message;
            }
        }
        return name;
    }

    public static Integer getCode(String name) {
        for (ResultCodeEnum item : ResultCodeEnum.values()) {
            if (item.name().equals(name)) {
                return item.code;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return this.name();
    }
}
