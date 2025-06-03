package ptu.fsd.nyaysahayak.act_service.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ptu.fsd.nyaysahayak.act_service.model.Act;
import ptu.fsd.nyaysahayak.act_service.services.ActService;


@RestController
@RequestMapping("/api/acts")

public class ActController {

	@Autowired
	private ActService service;
	
	@GetMapping
	private List<Act> getAllActs(){
		return service.getAllActs();
	}
	
	@GetMapping("/{id}")
	private ResponseEntity<Act> getActById(@PathVariable int id) {
		
		Optional<Act> act = service.getActById(id);        
		return act.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@PostMapping
    public Act createOrUpdateAct(@RequestBody Act act) {
        return service.saveAct(act);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Act> updateAct(@PathVariable int id, @RequestBody Act actDetails) {
        Act updatedAct = service.updateAct(id, actDetails);
        return updatedAct != null ? ResponseEntity.ok(updatedAct) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAct(@PathVariable int id) {
        service.deleteAct(id);
        return ResponseEntity.noContent().build();  
    }
}
