package ptu.fsd.nyaysahayak.favorite_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ptu.fsd.nyaysahayak.favorite_service.model.SavedAct;

public interface SavedActRepo extends JpaRepository<SavedAct, Integer>{

	
	 // Find all saved acts for a specific user
    List<SavedAct> findByUserEmailOrderBySavedAtDesc(String userEmail);
    
    // Check if a specific act is already saved by a user
    Optional<SavedAct> findByUserEmailAndActId(String userEmail, int actId);
    
    // Delete a saved act by user email and act ID
    void deleteByUserEmailAndActId(String userEmail, int actId);
    
    // Count saved acts for a user
    long countByUserEmail(String userEmail);
}
