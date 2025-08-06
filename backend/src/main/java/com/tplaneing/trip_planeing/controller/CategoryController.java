package com.tplaneing.trip_planeing.controller;

//Category model-repo
import com.tplaneing.trip_planeing.model.Category;
import com.tplaneing.trip_planeing.repository.CategoryRepository;

//Rest Annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/category")
    public Category saveCategory(@RequestBody Category category) { return categoryRepository.save(category); }

    @GetMapping("/category")
    public List<Category> getCategory() { return categoryRepository.findAll(); }
}
