package com.example.mechuli.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
//@Table(name = "tb_Store")
public class StoreEntity extends BaseEntity{

    @Id
    private Long idx;
    private String storeName;
    private String storeAddress;
    private String storeStar;
    private String storeReview;
}
