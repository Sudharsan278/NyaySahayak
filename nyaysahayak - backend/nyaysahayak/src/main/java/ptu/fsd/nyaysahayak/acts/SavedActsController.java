package ptu.fsd.nyaysahayak.acts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-acts")
@CrossOrigin(origins = "http://localhost:5173")
public class SavedActsController {
    
    @Autowired
    private SavedActsService savedActsService;
    
    // Save an act for a user
    @PostMapping
    public ResponseEntity<?> saveAct(@RequestBody Map<String, Object> request) {
        try {
            String userEmail = (String) request.get("userEmail");
            String userFirstName = (String) request.get("userFirstName");
            int actId = Integer.parseInt(request.get("actId").toString());
            
            SavedActs savedAct = savedActsService.saveActForUser(userEmail, userFirstName, actId);
            return ResponseEntity.ok(savedAct);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save act"));
        }
    }
    
    // Get all saved acts for a user
    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<SavedActs>> getUserSavedActs(@PathVariable String userEmail) {
        try {
            List<SavedActs> savedActs = savedActsService.getSavedActsByUser(userEmail);
            return ResponseEntity.ok(savedActs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Remove a saved act
    @DeleteMapping("/user/{userEmail}/act/{actId}")
    public ResponseEntity<?> removeSavedAct(@PathVariable String userEmail, @PathVariable int actId) {
        try {
            boolean removed = savedActsService.removeSavedAct(userEmail, actId);
            if (removed) {
                return ResponseEntity.ok(Map.of("message", "Act removed from saved list"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to remove saved act"));
        }
    }
    
    // Check if an act is saved by a user
    @GetMapping("/user/{userEmail}/act/{actId}/is-saved")
    public ResponseEntity<Map<String, Boolean>> isActSaved(@PathVariable String userEmail, @PathVariable int actId) {
        try {
            boolean isSaved = savedActsService.isActSavedByUser(userEmail, actId);
            return ResponseEntity.ok(Map.of("isSaved", isSaved));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get count of saved acts for a user
    @GetMapping("/user/{userEmail}/count")
    public ResponseEntity<Map<String, Long>> getSavedActsCount(@PathVariable String userEmail) {
        try {
            long count = savedActsService.getSavedActsCountByUser(userEmail);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}