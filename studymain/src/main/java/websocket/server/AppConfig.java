package websocket.server;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Created by chengyuxiang2 on 2020/12/11
 *
 * @Description: 应用启动类
 */
@SpringBootApplication
@Slf4j
public class AppConfig {

    public static void main(String[] args) {
        log.info("AppConfig begin");
        SpringApplication.run(AppConfig.class,args);
        log.info("AppConfig finish");
    }

}
