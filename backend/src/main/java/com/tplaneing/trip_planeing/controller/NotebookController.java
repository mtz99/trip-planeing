package com.tplaneing.trip_planeing.controller;

//Notes model-repo
import com.tplaneing.trip_planeing.model.Notes;
import com.tplaneing.trip_planeing.repository.NotesRepository;

//Rest Annotations
import org.springframework.beans.factory.annotation.Autowired;
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
}
