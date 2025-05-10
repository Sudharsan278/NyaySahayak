package ptu.fsd.nyaysahayak.acts;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/acts")
@CrossOrigin(origins = "http://localhost:5173")
public class ActsController {

	@Autowired
	private ActsService service;
	
	@GetMapping
	private List<Acts> getAllActs(){
		return service.getAllActs();
	}
	
	@GetMapping("/{id}")
	private ResponseEntity<Acts> getActById(@PathVariable int id) {
		
		Optional<Acts> act = service.getActById(id);        
		return act.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@PostMapping
    public Acts createOrUpdateAct(@RequestBody Acts act) {
        return service.saveAct(act);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Acts> updateAct(@PathVariable int id, @RequestBody Acts actDetails) {
        Acts updatedAct = service.updateAct(id, actDetails);
        return updatedAct != null ? ResponseEntity.ok(updatedAct) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAct(@PathVariable int id) {
        service.deleteAct(id);
        return ResponseEntity.noContent().build();  
    }
}
