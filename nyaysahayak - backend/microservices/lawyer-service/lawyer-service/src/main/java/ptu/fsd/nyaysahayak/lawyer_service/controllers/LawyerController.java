package ptu.fsd.nyaysahayak.lawyer_service.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ptu.fsd.nyaysahayak.lawyer_service.model.Lawyer;
import ptu.fsd.nyaysahayak.lawyer_service.services.LawyerService;

@RestController
@RequestMapping("/api/lawyers")
public class LawyerController {

	@Autowired
	private LawyerService service;
	
	 @GetMapping("/get-lawyers")
	    public List<Lawyer> getAllLawyers() {
	        return service.getAllLawyers();
	    }

	    @PostMapping("/save-lawyer")
	    public Lawyer addLawyer(@RequestBody Lawyer lawyer) {
	        return service.addLawyer(lawyer);
	    }
	
}
