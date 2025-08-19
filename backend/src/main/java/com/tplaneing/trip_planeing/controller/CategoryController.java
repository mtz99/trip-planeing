package com.tplaneing.trip_planeing.controller;

//Category model-repo
import com.tplaneing.trip_planeing.model.Category;
import com.tplaneing.trip_planeing.model.Notes;
import com.tplaneing.trip_planeing.repository.CategoryRepository;

//Rest Annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PutMapping("/category/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category categoryItem){
        //Search for note:
        return categoryRepository.findById(id)
                .map(existingCategory -> {
                    //Update the fields:
                    existingCategory.setContent(categoryItem.getContent());

                    //Save the updated note and return
                    Category updatedCategory = categoryRepository.save(existingCategory);
                    return ResponseEntity.ok(updatedCategory);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<Void> delCategory(@RequestBody @PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
