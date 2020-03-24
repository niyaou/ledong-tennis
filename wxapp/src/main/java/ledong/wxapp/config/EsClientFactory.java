package ledong.wxapp.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedList;
import java.util.Properties;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;

/**
 * 客户端
 * 
 * @author uidq1343
 *
 */
public class EsClientFactory {

    private static RestHighLevelClient client;

    /**
     * 初始化client
     */
    static {
        LinkedList<HttpHost> list = new LinkedList<HttpHost>();
        int timeout;
        Properties properties = new Properties();
        try {
            // 获取配置信息
            InputStream inputStream = EsClientFactory.class.getClassLoader().getResourceAsStream("es.properties");
            properties.load(inputStream);
            String cluster = properties.getProperty("es.node");
            String port = properties.getProperty("es.port");
            timeout = Integer.parseInt(properties.getProperty("es.timeout")) * 1000;
            HttpHost[] nodes = new HttpHost[cluster.split(",").length];
            for (String node : cluster.split(",")) {
                list.add(new HttpHost(node, Integer.parseInt(port), HttpHost.DEFAULT_SCHEME_NAME));
            }
            list.toArray(nodes);
            // 构建client
            final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            credentialsProvider.setCredentials(AuthScope.ANY,
                    new UsernamePasswordCredentials("elastic", "6geeVimEmGk9XDTBW7Un"));
            RestClientBuilder builder = RestClient.builder(nodes)
                    .setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback() {
                        @Override
                        public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder) {
                            return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
                        }
                    });
            client = new RestHighLevelClient(builder);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private volatile static EsClientFactory instance = null;

    public static EsClientFactory getInstance() {
        if (instance == null) {
            synchronized (EsClientFactory.class) {
                if (instance == null) {
                    instance = new EsClientFactory();
                }
            }
        }
        return instance;
    }

    public RestHighLevelClient getClient() {
        return client;
    }

    public void close() {
        if (client != null) {
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
