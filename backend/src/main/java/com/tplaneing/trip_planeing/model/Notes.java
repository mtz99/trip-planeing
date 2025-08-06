package com.tplaneing.trip_planeing.model;

import jakarta.persistence.*;

@Entity
public class Notes {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private String content;
    private String category;

    public Notes(){
    }

    public Long getId(){ return id; }

    public void setID(Long id){ this.id = id; }

    public String getNotesTitle() { return title; }

    public void setNotesTitle(String title){ this.title = title; }

    public String getNotesContent(){ return content; }

    public void setNotesContent(String content){ this.content = content; }

    public String getNotesCategories(){ return category; }

    public void setNotesCategories(String category){ this.category = category; }
}
