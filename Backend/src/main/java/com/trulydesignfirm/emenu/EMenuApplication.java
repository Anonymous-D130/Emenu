package com.trulydesignfirm.emenu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EMenuApplication {

    public static void main(String[] args) {
        SpringApplication.run(EMenuApplication.class, args);
    }

}
