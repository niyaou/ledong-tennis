package ledong.wxapp.search;

import java.io.IOException;
import java.util.*;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.ElasticsearchStatusException;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.DocWriteResponse.Result;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.get.MultiGetItemResponse;
import org.elasticsearch.action.get.MultiGetRequest;
import org.elasticsearch.action.get.MultiGetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.ClearScrollRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.action.support.WriteRequest.RefreshPolicy;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.DistanceUnit;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.GeoDistanceQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.DeleteByQueryRequest;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filter.Filter;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.SumAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.GeoDistanceSortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;

import ledong.wxapp.config.CustomException;
import ledong.wxapp.config.EsClientFactory;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import response.ErrorResponse;

/**
 * 提供对外的CRUD接口
 * 
 * @author uidq1343
 *
 */
public class SearchApi {
    public static final String TYPE = "_doc";
    public static final String ID = "id";
    public static final String TASKID = "taskId";
    public static final String VERSION = "version";
    public static final String SUM = "query_fileSize";
    public static final String VALUE = "value";
    public static final int PAGE = 0;
    public static final int DEFAULT_SIZE = 20;
    private static RestHighLevelClient client;
    private final static Logger log = Logger.getLogger(SearchApi.class);
    static {
        client = EsClientFactory.getInstance().getClient();
    }

    /**
     * 查询所有
     * 
     * @param indexName
     * @param pageNo
     * @param size
     * @return
     * @throws IOException
     */
    public static LinkedList<HashMap<String, Object>> searchAll(String indexName, Integer pageNo, Integer size)
            throws IOException {
        int scrollTimeOut = 200;
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        searchRequest.source(searchSourceBuilder);
        Scroll scroll = new Scroll(TimeValue.timeValueMillis(scrollTimeOut));
        searchRequest.scroll(scroll);
        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
        String scrollId = searchResponse.getScrollId();
        SearchHit[] hits = searchResponse.getHits().getHits();
        List<SearchHit> resultSearchHit = new ArrayList<>();
        LinkedList<HashMap<String, Object>> resultSearchMap = new LinkedList<>();
        while (hits.length > 0) {
            for (SearchHit hit : hits) {
                HashMap<String, Object> m = (HashMap<String, Object>) hit.getSourceAsMap();
                m.put(ID, hit.getId());
                m.put(VERSION, hit.getVersion());
                resultSearchMap.add(m);
                resultSearchHit.add(hit);
            }
            SearchScrollRequest searchScrollRequest = new SearchScrollRequest(scrollId);
            searchScrollRequest.scroll(scroll);
            SearchResponse searchScrollResponse = client.scroll(searchScrollRequest, RequestOptions.DEFAULT);
            scrollId = searchScrollResponse.getScrollId();
            hits = searchScrollResponse.getHits().getHits();
        }
        // 及时清除es快照，释放资源
        ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
        clearScrollRequest.addScrollId(scrollId);
        client.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
        return resultSearchMap;
    }

    /**
     * 根据ID查询,返回一个对象
     * 
     * @param indexName
     * @param type
     * @param id
     * @return
     */
    public static HashMap<String, Object> searchById(String indexName, String id) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

        // searchSourceBuilder.version(true);
        searchSourceBuilder.query(QueryBuilders.idsQuery().addIds(id));
        searchRequest.source(searchSourceBuilder);

        return parseSingleResponse(searchRequest);
    }

    /**
     * 
     * 根据ID批量获取文档
     * 
     */
    public static LinkedList<Map<String, Object>> getDocsByMultiIds(String indexName, String... ids) {
        MultiGetRequest request = new MultiGetRequest();
        Optional.ofNullable(ids).ifPresent(o -> {
            for (String id : o) {
                request.add(new MultiGetRequest.Item(indexName, id));
            }
        });

        MultiGetResponse response;
        LinkedList<Map<String, Object>> list = new LinkedList<Map<String, Object>>();
        try {
            response = client.mget(request, RequestOptions.DEFAULT);
            for (MultiGetItemResponse item : response.getResponses()) {
                list.add(item.getResponse().getSourceAsMap());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     *
     * 根据ID批量获取文档
     *
     */
    public static HashMap<String, HashMap<String, Object>> getDocsByMultiIdsWithMap(String indexName, String key,
            String... ids) {
        MultiGetRequest request = new MultiGetRequest();
        Optional.ofNullable(ids).ifPresent(o -> {
            for (String id : o) {
                request.add(new MultiGetRequest.Item(indexName, id));
            }
        });

        MultiGetResponse response;
        HashMap<String, HashMap<String, Object>> map = new HashMap<String, HashMap<String, Object>>();
        try {
            response = client.mget(request, RequestOptions.DEFAULT);
            for (MultiGetItemResponse item : response.getResponses()) {
                // list.add(item.getResponse().getSourceAsMap());
                map.put((String) item.getResponse().getSourceAsMap().get(key),
                        (HashMap<String, Object>) item.getResponse().getSourceAsMap());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return map;
    }

    /**
     * 查询特定字段的指定值
     * 
     * @param indexName
     * @param key
     * @param value
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByField(String indexName, String key, Object value,
            Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.version(true);
        searchSourceBuilder.query(QueryBuilders.termQuery(key, value));
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }


    public static LinkedList<HashMap<String, Object>> searchByFieldFussy(String indexName, String key, String value,
                                                                    Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.version(true);
        searchSourceBuilder.query( QueryBuilders.matchPhraseQuery(key, value));
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

//    /**
//     * 构造文本模糊查询条件
//     *
//     * @param key
//     * @param value
//     * @return
//     */
//    public static QueryBuilder createFussySearchSource(String key, String value) {
//        QueryBuilder matchQueryBuilder = QueryBuilders.matchPhraseQuery(key, value);
//        return matchQueryBuilder;
//    }



    /**
     * 查询多个字段满足某个条件
     * 
     * @param indexName
     * @param value
     * @param pageNo
     * @param size
     * @param keys
     * @return
     */
    public static QueryBuilder createMultiFieldsWithSingleValue(String value, String... keys) {

        // searchSourceBuilder.version(true);
        BoolQueryBuilder matchQueryBuilder = QueryBuilders.boolQuery();
        for (String key : keys) {
            matchQueryBuilder.should(QueryBuilders.termQuery(key, value));
        }
        return matchQueryBuilder;

    }

    /**
     * 查询特定字段的指定值
     * 
     * @param indexName
     * @param type
     * @param key
     * @param value
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByFieldAndType(String indexName, String type, String key,
            String value, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.version(true);
        searchSourceBuilder.query(QueryBuilders.termQuery(key, value));
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 指定标签的多条件查询
     * 
     * @param indexName
     * @param key
     * @param sortField
     * @param order
     * @param pageNo
     * @param size
     * @param values
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByFieldSortedWithValues(String indexName, String key,
            String sortField, SortOrder order, Integer pageNo, Integer size, String... values) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.termsQuery(key, values));
        searchSourceBuilder.sort(sortField, order);
        searchSourceBuilder.version(true);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 查询特定字段的指定值,按指定规则排序结果
     * 
     * @param sort
     * @param indexName
     * @param key
     * @param value
     * @param pageNo
     * @param size
     * @return
     */
    public static HashMap<String, HashMap<String, Object>> searchByFieldSortedInMap(String indexName, String key,
            String value, String sortField, SortOrder order, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.sort(sortField, order);
        searchSourceBuilder.version(true);
        if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(value)) {
            searchSourceBuilder.query(QueryBuilders.termQuery(key, value));
        } else {
            searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        }
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponseInMap(searchRequest);
    }

    /**
     * 查询特定字段的指定值,按指定规则排序结果
     * 
     * @param indexName
     * @param key
     * @param value
     * @param sort
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByFieldSorted(String indexName, String key, String value,
            String sortField, SortOrder order, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.sort(sortField, order);
        searchSourceBuilder.version(true);
        if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(value)) {
            searchSourceBuilder.query(QueryBuilders.termQuery(key, value));
        } else {
            searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        }
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    public static LinkedList<HashMap<String, Object>> searchByLocation(String indexName, String key, String value,
            String distance, Integer size) {
        if (size == null) {
            size = 50;
        }
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        GeoDistanceQueryBuilder qb = QueryBuilders.geoDistanceQuery(key);
        GeoDistanceSortBuilder sort = SortBuilders.geoDistanceSort(key, Double.parseDouble(value.split(",")[0]),
                Double.parseDouble(value.split(",")[1]));
        sort.unit(DistanceUnit.KILOMETERS).order(SortOrder.ASC);
        qb.point(Double.parseDouble(value.split(",")[0]), Double.parseDouble(value.split(",")[1]));
        qb.distance(String.format("%skm", distance));
        searchSourceBuilder.query(QueryBuilders.boolQuery().must(qb)).sort(sort);
        searchSourceBuilder.size(size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 
     * 根据排序条件查询指定条目
     * 
     * @param indexName
     * @param sortField
     * @param order
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByFieldSorted(String indexName, String sortField,
            SortOrder order, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.sort(sortField, order);
        searchSourceBuilder.query(createSearchAll()).size(size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * *查询所有数据
     * 
     * @return
     */
    public static QueryBuilder createSearchAll() {
        return QueryBuilders.matchAllQuery();
    }

    /**
     * * 构造单一查询条件
     * 
     * @param key
     * @param value
     * @return
     */
    public static QueryBuilder createSearchByFieldSource(String key, Object value) {
        return value == null ? null : QueryBuilders.termQuery(key, value);
    }

    /**
     * 够做多查询条件
     * 
     * @param key
     * @param values
     * @return
     */
    public static QueryBuilder createSearchByMultiSource(String key, String... values) {
        return QueryBuilders.termsQuery(key, values);
    }

    /**
     * 构造范围查询条件
     * 
     * @param key
     * @param start
     * @param end
     * @return
     */
    public static QueryBuilder createSearchByFieldRangeSource(String key, String start, String end) {
        RangeQueryBuilder range = new RangeQueryBuilder(key);
        range.gte(start);
        range.to(end);
        return range;
    }

    /**
     * 迟于某时间的查询
     * 
     * @param key
     * @param start
     * @return
     */
    public static QueryBuilder createSearchByFieldRangeGtSource(String key, Object start) {

        RangeQueryBuilder range = new RangeQueryBuilder(key);
        range.gt(start);
        return range;
    }

    /**
     * 早于某时间的检查
     * 
     * @param key
     * @param end
     * @return
     */
    public static QueryBuilder createSearchByFieldRangeLteSource(String key, String end, boolean isOnRim) {
        RangeQueryBuilder range = new RangeQueryBuilder(key);
        if (isOnRim) {
            range.lte(end);
        } else {
            range.lt(end);
        }
        return range;
    }

    /**
     * 构造文本模糊查询条件
     * 
     * @param key
     * @param value
     * @return
     */
    public static QueryBuilder createFussySearchSource(String key, String value) {
        QueryBuilder matchQueryBuilder = QueryBuilders.matchPhraseQuery(key, value);
        return matchQueryBuilder;
    }

    /**
     * 带占位符的模糊字符串查询
     * 
     * @param key
     * @param value
     * @return
     */
    public static QueryBuilder createWildCardSearchSource(String key, String value) {
        QueryBuilder matchQueryBuilder = QueryBuilders.wildcardQuery(key, "*" + value + "*");
        return matchQueryBuilder;
    }

    /**
     * 构造不等于指定值的查询条件
     * 
     * @param key
     * @param value
     * @return
     */
    public static QueryBuilder createNotSearchSource(String key, Object value) {
        QueryBuilder matchQueryBuilder = QueryBuilders.boolQuery().mustNot(QueryBuilders.termQuery(key, value));
        return matchQueryBuilder;
    }

    /**
     * *查询某个字段不存在或为空的文档
     * 
     * @param key
     * @return
     */
    public static QueryBuilder createEmptyOrNotExistedSource(String key) {
        QueryBuilder matchQueryBuilder = QueryBuilders.boolQuery()
                .should(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(key)))
                .should(QueryBuilders.matchQuery(key, ""));
        return matchQueryBuilder;
    }

    /**
     * *查询某个字段不存在的文档
     * 
     * @param key
     * @return
     */
    public static QueryBuilder createNotExistedSource(String key) {
        QueryBuilder matchQueryBuilder = QueryBuilders.boolQuery()
                .should(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(key)));
        return matchQueryBuilder;
    }

    public static Map<String, SortOrder> createSortProperties(List<String> sortProperties, String defaultValue) {
        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        if (sortProperties == null || sortProperties.size() == 0) {
            sortProperties = new ArrayList<String>();
            sortProperties.add("-" + defaultValue);
        }
        for (String sortPropertie : sortProperties) {
            if (sortPropertie.startsWith("+")) {
                sortPropertiesQueries.put(sortPropertie.substring(1, sortPropertie.length()), SortOrder.ASC);
            } else if (sortPropertie.startsWith("-")) {
                sortPropertiesQueries.put(sortPropertie.substring(1, sortPropertie.length()), SortOrder.DESC);
            }

        }
        return sortPropertiesQueries;
    }


    /**
     * update by script
     * @param indexName
     * @param id
     * @param script_str
     * @param params
     * @return
     */
    public static String updateIndexByScript(String indexName, String id, String script_str, Map<String, Object> params) {
        UpdateResponse updateResponse = null;
        Script script = new Script(ScriptType.INLINE, Script.DEFAULT_SCRIPT_LANG, script_str, params);
        try {
            UpdateRequest updateRequest = new UpdateRequest(indexName, id);
            updateRequest.script(script);
            updateRequest.upsertRequest();
            updateRequest.setRefreshPolicy(RefreshPolicy.IMMEDIATE);
            updateResponse = client.update(updateRequest, RequestOptions.DEFAULT);

        } catch (IOException e) {
            log.error(e.getMessage());

        }
        return updateResponse.getResult().equals(Result.UPDATED) ? updateResponse.getId() : null;
    }


    /**
     * @param index
     * @param type
     * @param id
     * @param field  需更新的字段
     * @param value
     * @param delete : (default false) -----> true delete an element from array
     *               -----> false add an element to array
     *
     */
    public static String updateExistListObject(String indexName, String id, Map<String, String> o, String field,
            boolean isDelete) {

        Map<String, String> map = o;
        String property = (String) map.keySet().toArray()[0];
        Map<String, Object> params = new HashMap<>();
        params.put(field, o);
        String script_str = null;
        Script script = null;
        UpdateResponse updateResponse = null;
        if (isDelete) {
            script_str = "for (int i=0;i<ctx._source." + field + ".size();i++)" + "{ if(ctx._source." + field + "[i]['"
                    + property + "'] == params." + field + "." + property + ")" + "{ctx._source." + field
                    + ".remove(i)}}";
        } else {
            // 表示如果该doc不包含该字段，在该doc新建字段并赋值value，
            // 如果存在该字段,会比较传入的对象是否存在于list中存在的对象相等，如果不相等就添加，相等就更新
            script_str = "if(!ctx._source.containsKey('" + field + "'))" + "{ctx._source." + field + "=[params." + field
                    + "]} " + "else { ctx._source." + field + ".add(params." + field + ")}";
        }
            script = new Script(ScriptType.INLINE, Script.DEFAULT_SCRIPT_LANG, script_str, params);

            // logger.info("script:\n"+script);
            // log.warn(String.format("错误信息 ： %s", script_str));

            // log.warn(String.format("params ： %s", script.getParams()));


        try {
            UpdateRequest updateRequest = new UpdateRequest(indexName, id);

            updateRequest.script(script);
            updateRequest.upsertRequest();
            updateRequest.setRefreshPolicy(RefreshPolicy.IMMEDIATE);
            updateResponse = client.update(updateRequest, RequestOptions.DEFAULT);

        } catch (IOException e) {
            log.error(e.getMessage());

        }
        return updateResponse.getResult().equals(Result.UPDATED) ? updateResponse.getId() : null;
    }

    /**
     * 模糊查询特定字段的指定值,按指定规则排序结果
     * 
     * @param indexName
     * @param key
     * @param value
     * @param sort
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> fussySearchByFieldSorted(String indexName, String key,
            String value, String sortField, SortOrder order, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        QueryBuilder matchQueryBuilder = QueryBuilders.matchPhraseQuery(key, value);
        searchSourceBuilder.sort(sortField, order);
        searchSourceBuilder.version(true);
        searchSourceBuilder.query(matchQueryBuilder);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 标签查询
     * 
     * @param indexName
     * @param key
     * @param value
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByNestedField(String indexName, String path, String key,
            String value, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.version(true);
        searchSourceBuilder.query(
                QueryBuilders.nestedQuery(path, QueryBuilders.matchQuery(path + "." + key, value), ScoreMode.None));
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 根据时间范围查询数据
     * 
     * @param indexName
     * @param key
     * @param value
     * @param type      0.早于某个时间范围，1.晚于某个时间范围
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByTerm(String indexName, String key, String value, int type,
            Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        RangeQueryBuilder range = new RangeQueryBuilder(key);
        if (type == 0) {
            range.lte(value);
        } else {
            range.gte(value);
        }
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchSourceBuilder.postFilter(range);
        searchSourceBuilder.version(true);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 根据时间段查询数据
     * 
     * @param indexName
     * @param key
     * @param startTime
     * @param endTime
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByTimeRange(String indexName, String key, String startTime,
            String endTime, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        RangeQueryBuilder range = new RangeQueryBuilder(key);
        range.gte(startTime);
        range.to(endTime);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchSourceBuilder.postFilter(range);
        searchSourceBuilder.version(true);
        searchSourceBuilder.sort(key, SortOrder.DESC);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    public static LinkedList<HashMap<String, Object>> searchByTimeGte(String indexName, String type, String key,
            String startTime, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        RangeQueryBuilder range = new RangeQueryBuilder(key);
        range.gte(startTime);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchSourceBuilder.postFilter(range);
        searchSourceBuilder.version(true);
        searchSourceBuilder.sort(key, SortOrder.DESC);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 对指定字段进行范围查询
     * 
     * @param indexName
     * @param key
     * @param startRange
     * @param endRange
     * @param order
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByGeneralRange(String indexName, String key,
            Object startRange, Object endRange, String sortField, SortOrder order, Integer pageNo, Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        RangeQueryBuilder range = new RangeQueryBuilder(key);
        range.gte(startRange);
        range.to(endRange);
        searchSourceBuilder.postFilter(range);
        searchSourceBuilder.version(true);
        searchSourceBuilder.sort(sortField, order);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * 多条件查询
     * 
     * @param indexName
     * @param multiVTerms
     * @param pageNo
     * @param size
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByMultiField(String indexName,
            @SuppressWarnings("rawtypes") Map multiTerms, String sortField, SortOrder order, Integer pageNo,
            Integer size) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        if (sortField != null && order != null) {
            searchSourceBuilder.sort(sortField, order);
        }
        @SuppressWarnings("unchecked")
        Set<String> set = multiTerms.keySet();
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        for (String key : set) {
            queryBuilder.must(QueryBuilders.termQuery(key, multiTerms.get(key)));
        }
        searchSourceBuilder.query(queryBuilder);
        searchSourceBuilder.version(true);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        return parseResponse(searchRequest);
    }

    /**
     * *多条件查询
     * 
     * @param indexName
     * @param sortField
     * @param order
     * @param pageNo
     * @param size
     * @param queries
     * @return
     */
    public static SearchResponse searchByMultiQueries(String indexName, List<String> sortProperties, SortOrder order,
            Integer pageNo, Integer size, QueryBuilder... queries) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        if (sortProperties != null && sortProperties.size() > 0) {
            for (String sortPropertie : sortProperties) {
                searchSourceBuilder.sort(sortPropertie, order);
            }
        }
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        for (QueryBuilder query : queries) {
            if (query == null) {
                continue;
            }
            queryBuilder.must(query);
        }
        searchSourceBuilder.query(queryBuilder);
        searchSourceBuilder.version(true);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            return searchResponse;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * *多条件查询
     * 
     * @param indexName
     * @param type
     * @param sortProperties
     * @param order
     * @param pageNo
     * @param size
     * @param queries
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByMultiQueriesWithType(String indexName, String type,
            List<String> sortProperties, SortOrder order, Integer pageNo, Integer size, String idName,
            QueryBuilder... queries) {
        if (TextUtils.isEmpty(idName)) {
            idName = ID;
        }
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        if (sortProperties != null && sortProperties.size() > 0) {
            for (String sortPropertie : sortProperties) {
                searchSourceBuilder.sort(sortPropertie, order);
            }
        }
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        for (QueryBuilder query : queries) {
            if (query == null) {
                continue;
            }
            queryBuilder.must(query);
        }
        searchSourceBuilder.query(queryBuilder);
        searchSourceBuilder.version(true);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);
        searchRequest.source(searchSourceBuilder);

        return parseResponse(searchRequest, idName);
    }

    /**
     * 多条件查询,多条件排序
     * 
     * @param indexName
     * @param type
     * @param sortProperties
     * @param pageNo
     * @param size
     * @param queries
     * @return
     */
    public static LinkedList<HashMap<String, Object>> searchByMultiQueriesAndOrders(String indexName,
            Map<String, SortOrder> sortProperties, Integer pageNo, Integer size, QueryBuilder... queries) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

        if (sortProperties != null) {
            for (Map.Entry<String, SortOrder> sortPropertie : sortProperties.entrySet()) {
                searchSourceBuilder.sort(sortPropertie.getKey(), sortPropertie.getValue());
            }
        }
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        for (QueryBuilder query : queries) {
            if (query == null) {
                continue;
            }
            queryBuilder.must(query);
        }
        searchSourceBuilder.query(queryBuilder);
        searchSourceBuilder.version(true);
        searchSourceBuilder = createPageAble(searchSourceBuilder, pageNo, size);

        searchRequest.source(searchSourceBuilder);
        // log.info(searchSourceBuilder.toString());
        // try {
        // SearchResponse searchResponse = client.search(searchRequest,
        // RequestOptions.DEFAULT);
        // return searchResponse;
        // } catch (IOException e) {
        // log.error(e.getMessage());
        //
        // }
        return parseResponse(searchRequest);
    }

    /**
     * 根据传入的查询条件检索文档
     * 
     * @param indexName
     * @param query
     * @return
     */
    public static SearchResponse searchByQueryBuilder(String indexName, QueryBuilder... queries) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        for (QueryBuilder query : queries) {
            if (query == null) {
                continue;
            }
            queryBuilder.must(query);
        }
        searchSourceBuilder.query(queryBuilder);
        searchSourceBuilder.version(true);
        searchRequest.source(searchSourceBuilder);
        // log.info(searchSourceBuilder.toString());
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            return searchResponse;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 根据传入的查询条件检索文档
     *
     * @param indexName
     * @param query
     * @return
     */
    public static SearchResponse searchByQueryBuilderShould(String indexName, QueryBuilder... queries) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        for (QueryBuilder query : queries) {
            if (query == null) {
                continue;
            }
            queryBuilder.should(query);
        }
        searchSourceBuilder.query(queryBuilder);
        searchSourceBuilder.version(true);
        searchRequest.source(searchSourceBuilder);
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            return searchResponse;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    public static Long indexCount(String indexName) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        searchRequest.source(searchSourceBuilder);
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            Long hits = searchResponse.getHits().getTotalHits().value;
            return hits;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    public static SearchResponse H2HOpponentAggs(String indexName, QueryBuilder... queries) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().size(0);
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        for (QueryBuilder query : queries) {
            if (query == null) {
                continue;
            }
            boolQueryBuilder.should(query);
        }

        TermsAggregationBuilder opps = AggregationBuilders.terms("holder").field("holder");
        TermsAggregationBuilder opps2 = AggregationBuilders.terms("challenger").field("challenger");
        searchSourceBuilder.query(boolQueryBuilder).aggregation(opps).aggregation(opps2);
        searchRequest.source(searchSourceBuilder);
        // log.info(searchSourceBuilder.toString());
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            return searchResponse;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    public static SearchResponse dailyFinancialAggs(String indexName, AggregationBuilder ...aggs ) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().size(0);

        for (AggregationBuilder subagg : aggs) {
            if (subagg == null) {
                continue;
            }
            searchSourceBuilder.aggregation(subagg);
        }

        searchRequest.source(searchSourceBuilder);
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            return searchResponse;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }



    public static SearchResponse fileStatiscByParams(String indexName, QueryBuilder... queries) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().size(0);
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        if (queries == null || queries.length == 0) {
            boolQueryBuilder.must(QueryBuilders.matchAllQuery());
        } else {
            for (QueryBuilder query : queries) {
                if (query == null) {
                    continue;
                }
                boolQueryBuilder.must(query);
            }
        }
        SumAggregationBuilder sum = AggregationBuilders.sum("query_fileSize").field("fileSize");
        searchSourceBuilder.query(boolQueryBuilder).aggregation(sum);
        searchRequest.source(searchSourceBuilder);
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            return searchResponse;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 插入数据
     * 
     * @param indexName
     * @param doc
     * @return
     */
    public static String insertDocument(String indexName, String doc) {
        IndexRequest indexRequest = new IndexRequest(indexName);
        indexRequest.source(doc, XContentType.JSON);
        return parseInsertResponse(indexRequest, null);
    }

    /**
     * 插入指定id数据
     * 
     * @param indexName
     * @param doc
     * @param id
     * @return
     */
    public static String insertDocument(String indexName, String doc, String id) {
        IndexRequest indexRequest = new IndexRequest(indexName);
        indexRequest.id(id);
        indexRequest.source(doc, XContentType.JSON);
        return parseInsertResponse(indexRequest, null);
    }

    /**
     * 删除数据
     * 
     * @param indexName
     * @param id
     * @return
     */
    public static DocWriteResponse deleteDocument(String indexName, String id) {
        DeleteRequest deleteRequest = new DeleteRequest(indexName, id);
        try {
            return client.delete(deleteRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            log.error(e.getMessage());
            return new ErrorResponse();
        }
    }

    /**
     * * 删除查询到的数据
     * 
     * @param indexName
     * @param type
     * @param field
     * @param value
     * @return
     * @throws IOException
     */
    public static BulkByScrollResponse deleteDocumentBySearchField(String indexName, String type, String field,
            String value) throws IOException {
        DeleteByQueryRequest request = new DeleteByQueryRequest(indexName);
        request.setConflicts("proceed");
        request.setQuery(QueryBuilders.termQuery(field, value));
        request.setBatchSize(100);
        request.setSlices(2);
        request.setScroll(TimeValue.timeValueMinutes(10));
        BulkByScrollResponse bulkResponse = client.deleteByQuery(request, RequestOptions.DEFAULT);
        return bulkResponse;
    }

    /**
     * 更新数据
     * 
     * @param indexName
     * @param doc
     * @param id
     * @return
     */
    public static String updateDocument(String indexName, String doc, String id) {
        UpdateRequest updateRequest = new UpdateRequest(indexName, id);
        updateRequest.setRefreshPolicy(RefreshPolicy.IMMEDIATE);
        updateRequest.doc(doc, XContentType.JSON);
        updateRequest.upsertRequest();
        return parseUpdateResponse(updateRequest);

    }


    public static String appendFieldValueById(String indexName, String field, Object value, String id){
        try {
            Map<String, Object> parameters = new HashMap<String,Object>();
            parameters.put("value",value);
            Script inline = new Script(ScriptType.INLINE, "painless",
                    "ctx._source."+field+" += params.value", parameters);
            UpdateRequest updateRequest = new UpdateRequest(indexName, id);
            updateRequest.script(inline);
            DocWriteResponse res = client.update(updateRequest, RequestOptions.DEFAULT);
            return res.getResult().equals(Result.UPDATED) ? res.getId() : null;
        } catch (IOException e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public static String appendNestedFieldValueById(String indexName, String field,   HashMap<String,Object> value, String id){
        try {


            Map<String, Object> personCerts = Collections.singletonMap("value",value);

//            Script inline = new Script(ScriptType.INLINE, "painless",
//                    "if(ctx._source."+field+"==null){ctx._source."+field+"=params.value}else{ if (!(ctx._source."+field+" instanceof Collection)) {ctx._source."+field+" = [ctx._source.\"+field+\"];} ctx._source."+field+".add(params.value) }", parameters);
            Script inline = new Script(ScriptType.INLINE, "painless",
                    "if(!ctx._source.containsKey('"+field+"')){ctx._source."+field+"=[params.value]}else{ctx._source."+field+".add(params.value)}  ", personCerts);
            System.out.println(inline.toString());
            UpdateRequest updateRequest = new UpdateRequest(indexName, id);
            updateRequest.script(inline);
            System.out.println(updateRequest.toString());
            DocWriteResponse res = client.update(updateRequest, RequestOptions.DEFAULT);
            return res.getResult().equals(Result.UPDATED) ? res.getId() : null;
        } catch (IOException e) {
            log.error(e.getMessage());
            return null;
        }
    }


    /**
     * 更新指定字段
     * 
     * @param indexName
     * @param field
     * @param value
     * @param id
     * @return
     */
    public static String updateFieldValueById(String indexName, String field, Object value, String id) {

        try {
            XContentBuilder builder = XContentFactory.jsonBuilder();
            builder.startObject();
            {
                builder.field(field, value);
            }
            builder.endObject();
            // return client.update(updateRequest, RequestOptions.DEFAULT);
            UpdateRequest updateRequest = new UpdateRequest(indexName, id).doc(builder);

            DocWriteResponse res = client.update(updateRequest, RequestOptions.DEFAULT);
            return res.getResult().equals(Result.UPDATED) ? res.getId() : null;
        } catch (IOException e) {
            log.error(e.getMessage());
            return null;
        }
    }

    /**
     * 更新指定字段
     *
     * @param indexName
     * @param valueMap
     * @param id
     * @return
     */
    public static String updateFieldMapValueById(String indexName,HashMap <String,Object >valueMap, String id) {

        try {
            XContentBuilder builder = XContentFactory.jsonBuilder();
            builder.startObject();
            {
                for (String field : valueMap.keySet()){
                    builder.field(field, valueMap.get(field));
                }
            }
            builder.endObject();
            // return client.update(updateRequest, RequestOptions.DEFAULT);
            UpdateRequest updateRequest = new UpdateRequest(indexName, id).doc(builder);

            DocWriteResponse res = client.update(updateRequest, RequestOptions.DEFAULT);
            return res.getResult().equals(Result.UPDATED) ? res.getId() : null;
        } catch (IOException e) {
            log.error(e.getMessage());
            return null;
        }
    }


    public static DocWriteResponse removeDocumentSource(String indexName, String type, String doc, String id,
            String... fields) {
        try {
            UpdateRequest updateRequest = new UpdateRequest(indexName, type, id);
            for (String string : fields) {
                updateRequest.script(new Script(String.format("ctx._source.remove(\"%s\")", string)));
                updateRequest.upsertRequest();
                client.update(updateRequest, RequestOptions.DEFAULT);
            }
            return client.update(updateRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            log.error(e.getMessage());
            return new ErrorResponse();
        }
    }

    /**
     * 更新某版本号的数据，实现乐观锁
     * 
     * @param indexName
     * @param type
     * @param doc
     * @param id
     * @param version
     * @return
     */
    public static DocWriteResponse updateDocumentByLock(String indexName, String type, String doc, String id,
            long version) throws ElasticsearchException {
        UpdateRequest updateRequest = new UpdateRequest(indexName, type, id);
        updateRequest.version(version);
        updateRequest.doc(doc, XContentType.JSON);
        updateRequest.upsertRequest();
        try {
            return client.update(updateRequest, RequestOptions.DEFAULT);
        } catch (ElasticsearchStatusException r) {
            r.printStackTrace();
            throw r;
        } catch (IOException e) {
            log.error(e.getMessage());
            return new ErrorResponse();
        } catch (Exception x) {
            x.printStackTrace();
            throw x;
        }
    }

    public static Double winRateAggregate(String indexName, SearchSourceBuilder searchSourceBuilder) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        searchRequest.source(searchSourceBuilder);
        // log.info(searchSourceBuilder.toString());
        HashMap<String, Object> list = new HashMap<String, Object>();
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

            long a = searchResponse.getHits().getHits().length;
            list.put("total", a);
            Filter f = searchResponse.getAggregations().get("winrate");
            list.put("date", f.getDocCount());
            // log.info(list);
            // log.info( Double.parseDouble(String.valueOf(f.getDocCount() * 100 / a)));
            return Double.parseDouble(String.valueOf(f.getDocCount() * 100 / a));
        } catch (IOException | ArithmeticException e) {
            log.error(e.getMessage());
            return 0.0;
        }

    }

    public static String mostPlayedCourt(String indexName, SearchSourceBuilder searchSourceBuilder) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        searchRequest.source(searchSourceBuilder);
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

            Terms t = searchResponse.getAggregations().get("court");

            return t.getBuckets().size() == 0 ? null : t.getBuckets().get(0).getKeyAsString();
        } catch (IOException | ArithmeticException e) {
            log.error(e.getMessage());

        }
        return null;
    }

    public static void bulkUpsert(BulkRequest request) throws IOException {
        // BulkRequest request = new BulkRequest();

        client.bulk(request, RequestOptions.DEFAULT);
    }

    /**
     * 创建搜索页码
     * 
     * @param searchSourceBuilder
     * @param pageNo
     * @param size
     * @return
     */
    private static SearchSourceBuilder createPageAble(SearchSourceBuilder searchSourceBuilder, Integer pageNo,
            Integer size) {
        if (pageNo != null && size != null && pageNo > 0 && size > 0) {
            pageNo--;
            searchSourceBuilder.from(pageNo * size);
            searchSourceBuilder.size(size);
        } else if (pageNo != null && pageNo > 0) {
            pageNo--;
            searchSourceBuilder.from(pageNo * DEFAULT_SIZE);
            searchSourceBuilder.size(DEFAULT_SIZE);
        } else if (size != null && size > 0) {
            searchSourceBuilder.from(PAGE * size);
            searchSourceBuilder.size(size);
        } else {
            searchSourceBuilder.from(PAGE);
            searchSourceBuilder.size(DEFAULT_SIZE);
        }
        return searchSourceBuilder;
    }

    public static int[] createPageAbleArr(Integer pageNo, Integer size, int total) {
        if (pageNo != null && size != null && pageNo > 0 && size > 0) {
            if (pageNo * size > total) {
                return new int[] { total / size, size };
            } else {
                return new int[] { --pageNo, size };
            }

        } else {
            return new int[] { PAGE, DEFAULT_SIZE };
        }

    }

    private static HashMap<String, Object> parseSingleResponse(SearchRequest searchRequest) {
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();
            for (SearchHit hit : searchHits) {
                HashMap<String, Object> m = (HashMap<String, Object>) hit.getSourceAsMap();
                m.put(ID, hit.getId());
                m.put(VERSION, hit.getVersion());
                return m;
            }
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    private static String parseUpdateResponse(UpdateRequest searchRequest) {
        try {
            DocWriteResponse updateResponse = client.update(searchRequest, RequestOptions.DEFAULT);
            // log.info(updateResponse.getResult().toString());
            if (updateResponse.getResult().toString().equals(Result.UPDATED.toString())) {
                return updateResponse.getId();
            }
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 搜索数据，生成结果
     * 
     * @param searchRequest
     * @return
     */
    private static LinkedList<HashMap<String, Object>> parseResponse(SearchRequest searchRequest) {
        LinkedList<HashMap<String, Object>> list = new LinkedList<HashMap<String, Object>>();
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();
            for (SearchHit hit : searchHits) {
                HashMap<String, Object> m = (HashMap<String, Object>) hit.getSourceAsMap();
                m.put(ID, hit.getId());
                m.put(VERSION, hit.getVersion());
                list.add(m);
            }
            return list.size() != 0 ? list : null;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 搜索数据，生成结果,使用map封装对象
     *
     * @param searchRequest
     * @return
     */
    private static HashMap<String, HashMap<String, Object>> parseResponseInMap(SearchRequest searchRequest) {
        HashMap<String, HashMap<String, Object>> map = new HashMap<String, HashMap<String, Object>>();
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();
            for (SearchHit hit : searchHits) {
                HashMap<String, Object> m = (HashMap<String, Object>) hit.getSourceAsMap();
                m.put(ID, hit.getId());
                m.put(VERSION, hit.getVersion());
                map.put(hit.getId(), m);
            }
            return map.size() != 0 ? map : null;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 
     * 
     * @param searchRequest
     * @param indexName
     * @return
     */
    public static Integer totalRawResponse(SearchSourceBuilder query, String indexName) {
        SearchRequest searchRequest = new SearchRequest(indexName);
        searchRequest.source(query);
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();
            return searchHits.length;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 搜索数据，生成结果
     * 
     * @param searchRequest
     * @param idName
     * @return
     */
    private static LinkedList<HashMap<String, Object>> parseResponse(SearchRequest searchRequest, String idName) {
        LinkedList<HashMap<String, Object>> list = new LinkedList<HashMap<String, Object>>();
        try {
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            SearchHit[] searchHits = searchResponse.getHits().getHits();
            for (SearchHit hit : searchHits) {
                HashMap<String, Object> m = (HashMap<String, Object>) hit.getSourceAsMap();
                m.put(idName, hit.getId());
                m.put(VERSION, hit.getVersion());
                list.add(m);
            }
            return list.size() != 0 ? list : null;
        } catch (IOException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 搜索数据，生成结果
     * 
     * @param searchRequest
     * @param idName
     * @return
     */
    private static String parseInsertResponse(IndexRequest searchRequest, String idName) throws CustomException {
        try {
            IndexResponse indexResponse = client.index(searchRequest, RequestOptions.DEFAULT);
            if (Result.CREATED.toString().equals(indexResponse.getResult().name())) {
                return indexResponse.getId();
            }
        } catch (IOException e) {
            log.error("---------throw exception--------");
            throw new CustomException(ResultCodeEnum.ALREADY_POSTED_CHALLENGE);
        }
        return null;
    }

}
