package com.example.mechuli;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class MechuliApplication {

	public static void main(String[] args) {
		SpringApplication.run(MechuliApplication.class, args);
	}

}

