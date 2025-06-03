package ptu.fsd.nyaysahayak.lawyer_service.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ptu.fsd.nyaysahayak.lawyer_service.model.Lawyer;
import ptu.fsd.nyaysahayak.lawyer_service.repository.LawyerRepo;

@Service
public class LawyerService {

	@Autowired
	private LawyerRepo repo;

	
	public List<Lawyer> getAllLawyers(){
		return repo.findAll();
	}
	
	public Lawyer addLawyer(Lawyer lawyer) {
		return repo.save(lawyer);
	}
	
}
