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
    private String createdAt;

    public Notes(){
    }

    public Long getId(){ return id; }

    public void setID(Long id){ this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title){ this.title = title; }

    public String getContent(){ return content; }

    public void setContent(String content){ this.content = content; }

    public String getCategory(){ return category; }

    public void setCategory(String category){ this.category = category; }

    public String getCreatedAt(){ return createdAt; }

    public void setCreatedAt(String createdAt){ this.createdAt = createdAt; }
}
