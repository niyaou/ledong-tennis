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

    /** 用户错误：20001-29999 */
    /** 该用户在UID账号系统不存在 */
    UID_USER_NOT_EXIST(20101, "userId在UID账号系统不存在"),
    /** LDAP账户系统连接失败，请重新登录。 */
    LDAP_CONNECT_FAILED(20102, "LDAP账户系统连接失败，请重新登录。"),
    /** 用户未登录 */
    USER_NOT_LOGGED_IN(20103, "用户未登录"),
    /** 用户名或密码错误 */
    USER_LOGIN_ERROR(20104, "用户名或密码错误"),
    /** 账号已被禁用 */
    USER_ACCOUNT_FORBIDDEN(20105, "账号已被禁用"),
    /** 该用户不存在 */
    USER_NOT_EXIST(20106, "该用户不存在"),
    /** 该用户已存在 */
    USER_HAS_EXISTED(20107, "该用户已存在"),
    /** userId不能为空 */
    USER_ID_CANNOT_NULL(20108, "userId不能为空"),
    /** 该用户不存在该角色 */
    USER_HAVING_NOT_ROLE(20109, "userId不存在该roleId"),
    /** status只能为0或者1 */
    STATUS_JUST_ONLY_ONE_TWO(20110, "status只能为0或者1"),
    /** userId的长度小于等于20 */
    USER_ID_TOO_LONG(20111, "userId的长度小于等于20"),
    /** 不能删除自己 */
    USER_CANNOT_DELETE_SELF(20112, "不能删除自己"),

    /** roleName不能为空 */
    ROLE_NAME_CANNOT_NULL(20201, "roleName不能为空"),
    /** roleId不能为空 */
    ROLE_ID_CANNOT_NULL(20202, "roleId不能为空"),
    /** roleId不存在 */
    ROLE_NOT_EXISTED(20203, "roleId不存在"),
    /** roleName的长度小于等于40 */
    ROLE_NAME_TOO_LONG(20204, "roleName的长度小于等于40"),
    /** roleName已存在 */
    ROLE_NAME_EXISTED(20205, "roleName已存在"),
    /** roleId不存在 */
    ROLE_ID_NOT_EXISTED(20206, "roleId不存在"),
    /** 该角色不存在该权限 */
    ROLE_HAVING_NOT_PERMISSION(20207, "roleId不存在该permissionId"),

    /** permissionName不能为空 */
    PERMISSION_NAME_CANNOT_NULL(20301, "permissionName不能为空"),
    /** url不能为空 */
    PERMISSION_URL_CANNOT_NULL(20302, "url不能为空"),
    /** 权限对应的url不符合url规范 */
    PERMISSION_URL_NOT_MATCH_REG(20303, "权限对应的url不符合url规范"),
    /** permissionId不能为空 */
    PERMISSION_ID_CANNOT_NULL(20304, "permissionId不能为空"),
    /** permissionName的长度小于等于40 */
    PERMISSION_NAME_TOO_LONG(20305, "permissionName的长度小于等于40"),
    /** permissionName已存在 */
    PERMISSION_NAME_EXISTED(20306, "permissionName已存在"),
    /** method不能为空 */
    PERMISSION_METHORD_CANNOT_NULL(20307, "method不能为空"),
    /** permissionId不存在 */
    PERMISSION_ID_NOT_EXISTED(20308, "permissionId不存在"),

    /** noticeEventName不能为空 */
    EVENT_NAME_CANNOT_NULL(20401, "noticeEventName不能为空"),
    /** noticeEventId不能为空 */
    EVENT_ID_CANNOT_NULL(20402, "noticeEventId不能为空"),
    /** noticeFrequencyName不能为空 */
    NOTICE_FREQUENCY_NAME_CANNOT_NULL(20403, "noticeFrequencyName不能为空"),
    /** noticeFrequencyId不能为空 */
    NOTICE_FREQUENCY_ID_CANNOT_NULL(20404, "noticeFrequencyId不能为空"),
    /** noticeEventName的长度小于等于40 */
    NOTICE_EVENT_NAME_TOO_LONG(20405, "noticeEventName的长度小于等于40"),
    /** noticeEventName已存在 */
    NOTICE_EVENT_NAME_EXISTED(20406, "noticeEventName已存在"),
    /** noticeEventId不存在 */
    NOTICE_EVENT_ID_NOT_EXISTED(20407, "noticeEventId不存在"),
    /** noticeFrequencyName的长度小于等于40 */
    NOTICE_FREQUENCE_NAME_TOO_LONG(20408, "noticeFrequencyName的长度小于等于40"),
    /** noticeFrequencyName已存在 */
    NOTICE_FREQUENCE_NAME_EXISTED(20409, "noticeFrequencyName已存在"),
    /** noticeFrequencyId不存在 */
    NOTICE_FREQUENCE_ID_NOT_EXISTED(20410, "noticeFrequencyId不存在"),

    /** tagName不能为空 */
    TAG_NAME_CANNOT_NULL(20501, "tagName不能为空"),
    /** tagId不能为空 */
    TAG_ID_CANNOT_NULL(20502, "tagId不能为空"),
    /** tagName的长度小于等于40 */
    TAG_NAME_TOO_LONG(20503, "tagName的长度小于等于40"),
    /** parentTagId不存在 */
    PARENT_TAG_ID_NOT_EXISTED(20504, "parentTagId不存在"),
    /** tagName已存在 */
    TAG_NAME_EXISTED(20505, "tagName已存在"),
    /** tagId不存在 */
    TAG_ID_NOT_EXISTED(20506, "tagId不存在"),

    /** deviceName不能为空 */
    DEVICE_NAME_CANNOT_NULL(20601, "deviceName不能为空"),
    /** deviceName不能为空 */
    DEVICE_NAME_TOO_LONG(20602, "deviceName的长度小于等于40"),
    /** deviceName已存在 */
    DEVICE_NAME_EXISTED(20603, "deviceName已存在"),
    /** deviceId不能为空 */
    DEVICE_ID_CANNOT_NULL(20604, "deviceId不能为空"),
    /** 该设备不存在 */
    DEVICE_NOT_EXISTED(20605, "deviceId不存在"),
    /** 该设备已经有该属性 */
    DEVICE_HAVING_ATTRIBUTE(20606, "deviceId已经存在该attributeId"),
    /** attributeId不能为空 */
    DEVICE_ATTRIBUTE_CANNOT_NULL(20607, "attributeId不能为空"),
    /** attributeId不存在 */
    ATTRIBUTE_NOT_EXISTED(20608, "attributeId不存在"),
    /** 该设备不存在该属性 */
    DEVICE_HAVING_NOT_ATTRIBUTE(20609, "deviceId不经存在该attributeId"),

    /** deviceTypeName不能为空 */
    DEVICE_TYPE_NAME_CONNOT_NULL(20701, "deviceTypeName不能为空"),
    /** deviceTypeName的长度小于等于40 */
    DEVICE_TYPE_NAME_TOO_LONG(20702, "deviceTypeName的长度小于等于40"),
    /** parentDeviceTypeId不存在 */
    DEVICE_TYPE_PARENT_ID_NOT_EXISTED(20703, "parentDeviceTypeId不存在 "),
    /** deviceTypeName已存在 */
    DEVICE_TYPE_NAME_EXISTED(20704, "deviceTypeName已存在"),
    /** deviceTypeId不能为空 */
    DEVICE_TYPE_ID_CANNOT_NULL(20705, "deviceTypeId不能为空"),
    /** deviceTypeId不存在 */
    DEVICE_TYPE_ID_NOT_EXISTED(20706, "deviceTypeId不存在 "),
    /** deviceId不存在该deviceTypeId */
    DEVICE_TYPE_HAVING_NOT_TYPE(20707, "deviceId不存在该deviceTypeId"),
    /** 该deviceId下存在子设备类型 */
    DEVICE_TYPE_HAVE_CHILD(20708, "parentDeviceTypeId下存在deviceTypeId"),

    /** productName不能为空 */
    PRODUCT_NAME_CANNOT_NULL(20801, "productName不能为空"),
    /** productName的长度小于等于40 */
    PRODUCT_NAME_TOO_LONG(20802, "productName的长度小于等于40"),
    /** productName已存在 */
    PRODUCT_NAME_EXISTED(20803, "productName已存在"),
    /** productId不能为空 */
    PRODUCT_ID_CANNOT_NULL(20804, "productId不能为空"),
    /** 该产品不存在 */
    PRODUCT_NOT_EXISTED(20805, "productId不存在"),
    /** productId已经存在该deviceId */
    PRODUCT_HAVING_DEVICE(20806, "productId已经存在该deviceId"),
    /** productId不经存在该deviceId */
    PRODUCT_HAVING_NOT_DEVICE(20807, "productId不经存在该deviceId"),

    /** subSystemName不能为空 */
    SUB_SYSTEM_NAME_CONNOT_NULL(20901, "subSystemName不能为空"),
    /** subSystemName的长度小于等于40 */
    SUB_SYSTEM_NAME_TOO_LONG(20902, "subSystemName的长度小于等于40"),
    /** subSystemName已存在 */
    SUB_SYSTEM_NAME_EXISTED(20903, "subSystemName已存在"),
    /** subSystemId不能为空 */
    SUB_SYSTEM_ID_CANNOT_NULL(20904, "subSystemId不能为空"),
    /** subSystemId不存在 */
    SUB_SYSTEM_ID_NOT_EXISTED(20905, "subSystemId不存在 "),
    /** subSystem不存在该用户 */
    SUB_SYSTEM_HAVING_NOT_USER(20906, "subSystem不存在该用户 "),
    /** subSystemId和groupId不匹配 */
    SUB_SYSTEM_NOT_MATCH_GROUP(20907, "subSystemId和groupId不匹配"),
    /** subSystem已经存在该用户 */
    SUB_SYSTEM_HAVING_EXISTED_USER(20908, "subSystem已经存在该用户 "),
    /** 请先从用户所属组移除该用户 */
    DELETE_USER_BEFORE_REMOVE(20909, "请先从用户所属组移除该用户 "),

    /** 预览文件路径不存在 */
    FILE_PREVIEW_PATH_NOT_EXISTED(21001, "预览文件路径不存在 "),
    /** 预览文件路径不存在 */
    FILE_PREVIEW_READ_EXCEPTION(21002, "预览文件读取异常"),
    /** 预览文件路径不存在 */
    FILE_ID_CANNOT_NULL(21003, "fileId不能为空"),
    /** startLine必须小于endLine */
    FILE_START_MUST_LT_END(21004, "startLine必须小于等于endLine"),
    /** 不支持该文件类型的预览 */
    FILE_PREVIEW_FILE_TYPE_NOT_SUPPORT(21005, "不支持该文件类型的预览"),
    /** 不能删除被使用的数据 */
    CAN_NOT_DELETE_USING_DATA(21006, "不能删除被使用的数据"),
    /** fileId不存在 */
    FILE_ID_NOT_EXISTED(21007, "fileId不存在"),
    /** 不能刪除拥有成员的组 */
    CAN_NOT_DELETE_GROUP_HAVED_MEMBERS(21008, "不能刪除拥有成员的组"),
    /** 不能删除被使用的算法 */
    CAN_NOT_DELETE_USING_ALG(21009, "不能删除被使用的算法"),

    /** 指定的priorityId不存在 */
    DICTIONARY_ID_NOT_EXISTED(31001, "priorityId不存在"),
    /** taskTypeId不存在 */
    TASK_TYPE_ID_NOT_EXISTED(31002, "taskTypeId不存在"),

    /** 同级下相同的name已存在 */
    LEVEL_TYPE_NAME_EXISTED(31003, "同级下相同的name已存在"),

    /** 不能同时作为审核员和标注员 */
    CAN_NOT_TWO_ROLE_SAME_TIME(31004, "不能同时作为审核员和标注员"),

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

    /** uploadLog不能为空 */
    UPLOAD_LOG_CANNOT_NULL(50014, "uploadLog不能为空"),
    /** uploadId不能为空 */
    UPLOAD_LOG_ID_CANNOT_NULL(50015, "uploadId不能为空"),
    /** upload不存在 */
    UPLOAD_LOG_NOT_EXISTED(50016, "upload不存在"),
    /** upload参数不能为空 */
    UPLOAD_LOG_PARAMS_CANNOT_NULL(50017, "upload参数不能为空"),
    /** 时间解析错误 */
    UPLOAD_LOG_DATE_PARSE_ERROR(50018, "时间解析错误"),
    /** 创建日志失败 */
    UPLOAD_LOG_DATE_CREATE_ERROR(50019, "创建日志失败"),
    /** 文件夹不存在 */
    DIRECTORY_NOT_EXISTED(50020, "文件夹不存在"),
    /** 文件夹不存在 */
    FILE_NOT_EXISTED(50021, "文件不存在"),

    /** 上传文件流出错 */
    FILE_INPUTSTREAM_ERROR(50022, "上传文件流出错 "),
    /** 无法删除文件夹 */
    TARGET_IS_FOLDER(50023, "无法删除文件夹"),

    /** 断点续传日志不存在 */
    CHUNKS_LOG_NOT_EXIST(50024, "断点续传日志不存在"),

    /** 文件夹已存在 */
    FOLDER_ALREADY_EXISTED(50025, "文件夹已存在"),

    /** 文件已存在 */
    FILE_ALREADY_EXISTED(50026, "文件已存在"),
    /** 文件已删除 */
    FILE_ALREADY_DELETED(50027, "文件已删除"),
    /** 文件已取消 */
    FILE_ALREADY_CANCELED(50028, "文件已取消"),
    /** 取消文件上传任务失败 */
    CANCELD_FILE_FAILD(50029, "取消文件上传任务失败"),

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
