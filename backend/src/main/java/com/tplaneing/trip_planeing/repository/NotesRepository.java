package com.tplaneing.trip_planeing.repository;

import com.tplaneing.trip_planeing.model.Notes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotesRepository extends JpaRepository <Notes, Long>{
}

