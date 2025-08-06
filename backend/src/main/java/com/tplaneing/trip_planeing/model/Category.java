package com.tplaneing.trip_planeing.model;

import jakarta.persistence.*;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String content;

    public Category(){
    }

    public Long getId(){ return id; }

    public void setID(Long id){ this.id = id; }

    public String getContent() { return content; }

    public void setContent(String content){ this.content = content; }

}
