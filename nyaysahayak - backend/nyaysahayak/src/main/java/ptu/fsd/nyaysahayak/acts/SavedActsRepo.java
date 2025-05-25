package ptu.fsd.nyaysahayak.acts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedActsRepo extends JpaRepository<SavedActs, Integer> {
    
    // Find all saved acts for a specific user
    List<SavedActs> findByUserEmailOrderBySavedAtDesc(String userEmail);
    
    // Check if a specific act is already saved by a user
    Optional<SavedActs> findByUserEmailAndActId(String userEmail, int actId);
    
    // Delete a saved act by user email and act ID
    void deleteByUserEmailAndActId(String userEmail, int actId);
    
    // Count saved acts for a user
    long countByUserEmail(String userEmail);
}