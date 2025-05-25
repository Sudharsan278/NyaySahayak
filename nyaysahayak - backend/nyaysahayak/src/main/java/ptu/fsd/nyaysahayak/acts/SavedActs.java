package ptu.fsd.nyaysahayak.acts;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SavedActs")
public class SavedActs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private String userFirstName;
    
    @Column(nullable = false)
    private int actId;
    
    @Column(length = 1000, nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String summary;
    
    @Column(length = 2000)
    private String impact;
    
    @Column(length = 2000)
    private String penalties;
    
    @Column(name = "saved_at")
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date savedAt;
    
    @PrePersist
    protected void onCreate() {
        savedAt = new java.util.Date();
    }
}