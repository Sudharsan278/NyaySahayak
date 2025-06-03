package ptu.fsd.nyaysahayak.act_service.model;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="Acts")
public class Act {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;                 
    private String category;             
    private int year;                    

    @Column(length = 2000)
    private String summary;              

    @Column(length = 1000)
    private String enactmentDate;        
    
    @Column(length = 1000)
    private String effectiveDate;        

    @Column(length = 3000)
    private String keyProvisions;        
    
    @Column(length = 2000)
    private String authoritiesInvolved; // Agencies/commissions formed under the act

    @Column(length = 2000)
    private String applicability;      // Who and what the act applies to
    
    @Column(length = 2000)
    private String penalties;            // Penalties and offenses if applicable

    @Column(length = 2000)
    private String impact;                // Social/economic/political significance

    
    @Column(length = 1000)
    @Nullable
    private String relatedLaws;          

    @Column(length = 500)
    private String tags;      
}
