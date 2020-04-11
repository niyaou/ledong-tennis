package ledong.wxapp;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

// @SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)

// @RunWith(SpringJUnit4ClassRunner.class)
// //告诉JUnitSpring配置文件
// @ContextConfiguration(classes = DemoApplicationTests.class)
@RunWith(SpringRunner.class)
//@SpringBootTest(classes = DemoApplicationTests.class)
public class DemoApplicationTests {

//    @Autowired
//    private RedisUtil redis;

    boolean flag = false;

    @Test
    public void contextLoads() throws Exception {

        LinkedList<HashMap<String, Object>> matches = new LinkedList<HashMap<String, Object>>();
        HashMap<String, Object> a = new HashMap<String, Object>();
        a.put("n", 1);
        a.put("h", 1);
        a.put("c", 2);
        a.put("w", 1);
        HashMap<String, Object> b = new HashMap<String, Object>();
        b.put("n", 2);
        b.put("h", 1);
        b.put("c", 2);
        b.put("w", 2);
        HashMap<String, Object> c = new HashMap<String, Object>();
        c.put("n", 3);
        c.put("h", 1);
        c.put("c", 2);
        c.put("w", 1);
        matches.push(a);
        matches.push(b);
        matches.push(c);
//        Optional<LinkedList<HashMap<String, Object>>> opt = Optional.ofNullable(matches);
//        Optional.ofNullable(matches).flatMap(u -> Optional.of(u.pop())).ifPresent(g -> System.out.println(g.get("n")));
        Optional.ofNullable(matches).ifPresent(u -> {
            flag = u.stream().filter(x -> {
                Object hhh = x.get(x.get("w").equals(1) ? "h" : "c");
                System.out.println(hhh);
                boolean gg = hhh.equals(1);
                return gg;
            }).count() == 3L;
        });

        assertTrue(flag);

    }

}
