package response;

import static org.elasticsearch.common.xcontent.XContentParserUtils.ensureExpectedToken;

import java.io.IOException;

import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.common.Strings;
import org.elasticsearch.common.xcontent.XContentParser;
import org.elasticsearch.index.Index;
import org.elasticsearch.index.shard.ShardId;
import org.elasticsearch.rest.RestStatus;

/**
 * 
 * @author uidq1343
 *
 */
public class ErrorResponse extends DocWriteResponse {
    public ErrorResponse() {
       
        this(new ShardId(new Index("error","0000"),0), "type",  "id",  999L,  999L,  999L, Result.NOOP );
    }

    public ErrorResponse(ShardId shardId, String type, String id, long seqNo, long primaryTerm, long version, boolean created) {
        this(shardId, type, id, seqNo, primaryTerm, version, created ? Result.CREATED : Result.UPDATED);
    }

    private ErrorResponse(ShardId shardId, String type, String id, long seqNo, long primaryTerm, long version, Result result) {
        super(shardId, type, id, seqNo, primaryTerm, version, assertCreatedOrUpdated(result));
    }

    private static Result assertCreatedOrUpdated(Result result) {
        return result;
    }

    @Override
    public RestStatus status() {
        return result == Result.NOOP ? RestStatus.EXPECTATION_FAILED : super.status();
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("ErrorResponse[");
        builder.append("index=").append(getIndex());
        builder.append(",type=").append(getType());
        builder.append(",id=").append(getId());
        builder.append(",version=").append(getVersion());
        builder.append(",result=").append(getResult().getLowercase());
        builder.append(",seqNo=").append(getSeqNo());
        builder.append(",primaryTerm=").append(getPrimaryTerm());
        builder.append(",shards=").append(Strings.toString(getShardInfo()));
        return builder.append("]").toString();
    }

    public static ErrorResponse fromXContent(XContentParser parser) throws IOException {
        ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.nextToken(), parser::getTokenLocation);

        Builder context = new Builder();
        while (parser.nextToken() != XContentParser.Token.END_OBJECT) {
            parseXContentFields(parser, context);
        }
        return context.build();
    }

    /**
     * Parse the current token and update the parsing context appropriately.
     */
    public static void parseXContentFields(XContentParser parser, Builder context) throws IOException {
        DocWriteResponse.parseInnerToXContent(parser, context);
    }

    /**
     * Builder class for {@link IndexResponse}. This builder is usually used during xcontent parsing to
     * temporarily store the parsed values, then the {@link Builder#build()} method is called to
     * instantiate the {@link IndexResponse}.
     */
    public static class Builder extends DocWriteResponse.Builder {
        @Override
        public ErrorResponse build() {
            ErrorResponse indexResponse = new ErrorResponse(shardId, type, id, seqNo, primaryTerm, version, result);
            indexResponse.setForcedRefresh(forcedRefresh);
            if (shardInfo != null) {
                indexResponse.setShardInfo(shardInfo);
            }
            return indexResponse;
        }
    }
}
