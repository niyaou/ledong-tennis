package ledong.wxapp;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ContextConfiguration;

import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;

import ledong.wxapp.redis.RedisUtil;

// @SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)

// @RunWith(SpringJUnit4ClassRunner.class)
// //告诉JUnitSpring配置文件
// @ContextConfiguration(classes = DemoApplicationTests.class)
@RunWith(SpringRunner.class)
@SpringBootTest(classes=RedisUtil.class)
class DemoApplicationTests {

    @Autowired
    private RedisUtil redis;

    @Test
    public void contextLoads()  throws Exception{
        Object a = redis.get("key");
        System.out.println(a.toString());
        assertTrue(false);
    }

}
