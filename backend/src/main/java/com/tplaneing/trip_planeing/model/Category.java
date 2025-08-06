package com.tplaneing.trip_planeing.model;

import jakarta.persistence.*;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String category;

    public Category(){
    }

    public Long getId(){ return id; }

    public void setID(Long id){ this.id = id; }

    public String getCategory() { return category; }

    public void setCategory(String category){ this.category = category; }

}
