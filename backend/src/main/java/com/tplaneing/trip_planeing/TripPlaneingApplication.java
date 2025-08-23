package com.tplaneing.trip_planeing;

import com.tplaneing.trip_planeing.model.Category;
import com.tplaneing.trip_planeing.repository.CategoryRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import java.util.stream.Stream;

@SpringBootApplication
public class TripPlaneingApplication {

	public static void main(String[] args) {
		SpringApplication.run(TripPlaneingApplication.class, args);
	}

    @Bean
    CommandLineRunner init(CategoryRepository categoryRepository) {
        return args -> {
            //Check if categories already exist
            if (categoryRepository.count() == 0) {
                Stream.of("Activities", "Food", "Hotels", "Transportation")
                        .forEach(categoryContent -> {
                            Category category = new Category();
                            category.setContent(categoryContent);
                            categoryRepository.save(category);
                        });
            }
        };
    }
}
