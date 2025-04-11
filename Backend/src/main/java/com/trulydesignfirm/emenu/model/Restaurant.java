package com.trulydesignfirm.emenu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String mobile;

    @Column(unique = true, nullable = false)
    private String pageName;

    @Column(nullable = false)
    private String logo;

    @Column(nullable = false)
    private String welcomeScreen;

    private boolean active;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> categories;

    @ElementCollection
    private List<String> qrCodes;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private LoginUser owner;

    public int getTables(){
        return qrCodes.size();
    }
}