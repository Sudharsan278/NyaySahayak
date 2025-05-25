package ptu.fsd.nyaysahayak.acts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ptu.fsd.nyaysahayak.acts.Acts;
import ptu.fsd.nyaysahayak.acts.ActsService;

import java.util.List;
import java.util.Optional;

@Service
public class SavedActsService {
    
    @Autowired
    private SavedActsRepo savedActsRepo;
    
    @Autowired
    private ActsService actsService;
    
    // Save an act for a user
    public SavedActs saveActForUser(String userEmail, String userFirstName, int actId) {
        // Check if already saved
        Optional<SavedActs> existing = savedActsRepo.findByUserEmailAndActId(userEmail, actId);
        if (existing.isPresent()) {
            throw new RuntimeException("Act already saved by user");
        }
        
        // Get the original act details
        Optional<Acts> actOptional = actsService.getActById(actId);
        if (!actOptional.isPresent()) {
            throw new RuntimeException("Act not found");
        }
        
        Acts act = actOptional.get();
        
        // Create saved act
        SavedActs savedAct = new SavedActs();
        savedAct.setUserEmail(userEmail);
        savedAct.setUserFirstName(userFirstName);
        savedAct.setActId(actId);
        savedAct.setTitle(act.getTitle());
        savedAct.setSummary(act.getSummary());
        savedAct.setImpact(act.getImpact());
        savedAct.setPenalties(act.getPenalties());
        
        return savedActsRepo.save(savedAct);
    }
    
    // Get all saved acts for a user
    public List<SavedActs> getSavedActsByUser(String userEmail) {
        return savedActsRepo.findByUserEmailOrderBySavedAtDesc(userEmail);
    }
    
    // Remove a saved act
    @Transactional
    public boolean removeSavedAct(String userEmail, int actId) {
        Optional<SavedActs> savedAct = savedActsRepo.findByUserEmailAndActId(userEmail, actId);
        if (savedAct.isPresent()) {
            savedActsRepo.deleteByUserEmailAndActId(userEmail, actId);
            return true;
        }
        return false;
    }
    
    // Check if an act is saved by a user
    public boolean isActSavedByUser(String userEmail, int actId) {
        return savedActsRepo.findByUserEmailAndActId(userEmail, actId).isPresent();
    }
    
    // Get count of saved acts for a user
    public long getSavedActsCountByUser(String userEmail) {
        return savedActsRepo.countByUserEmail(userEmail);
    }
}