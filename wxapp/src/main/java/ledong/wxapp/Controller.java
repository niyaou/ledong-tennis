package ledong.wxapp;

import java.util.HashMap;
import java.util.LinkedList;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ledong.wxapp.config.EsClientFactory;
import ledong.wxapp.search.SearchApi;

@RestController
public class Controller {
    private static RestHighLevelClient client;
    static {
        client = EsClientFactory.getInstance().getClient();
    }

    @RequestMapping("/")
    public String home() {
        LinkedList<HashMap<String, Object>> o = SearchApi.searchByTimeRange("session_information",
                "holderContext.postTime", "2017-01-01 00:00:00", "2019-01-01 00:00:00", null, null);
        return o.toString();
    }
}