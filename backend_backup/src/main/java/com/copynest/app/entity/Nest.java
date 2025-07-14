package com.copynest.app.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "nests")
public class Nest {

    @Id
    private String id;
    private String uid;
    private String title;
    private String content;

    public Nest() {
    }

    public Nest(String title, String content, String uid ) {
        this.title = title;
        this.content = content;
        this.uid = uid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUid (){
        return uid;
    }

    public void setUid(String uid){
        this.uid = uid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
