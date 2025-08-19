package com.tplaneing.trip_planeing.controller;

//Notes model-repo
import com.tplaneing.trip_planeing.model.Notes;
import com.tplaneing.trip_planeing.repository.NotesRepository;

//Rest Annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotebookController {

    @Autowired
    private NotesRepository notesRepository;

    @PostMapping("/notes")
    public Notes saveNotes(@RequestBody Notes notes) { return notesRepository.save(notes); }

    @GetMapping("/notes")
    public List<Notes> getNotes() { return notesRepository.findAll(); }

    @PutMapping("/notes/{id}")
    public ResponseEntity<Notes> updateNote(@PathVariable Long id, @RequestBody Notes noteDetails){
        //Search for note:
        return notesRepository.findById(id)
            .map(existingNote -> {
                //Update the fields:
                existingNote.setTitle(noteDetails.getTitle());
                existingNote.setContent(noteDetails.getContent());
                existingNote.setCategories(noteDetails.getCategories());

                //Save the updated note and return
                Notes updatedNote = notesRepository.save(existingNote);
                return ResponseEntity.ok(updatedNote);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> delNote(@RequestBody @PathVariable Long id) {
        notesRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
