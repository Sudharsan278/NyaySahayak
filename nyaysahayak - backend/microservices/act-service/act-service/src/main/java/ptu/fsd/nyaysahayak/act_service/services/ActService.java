package ptu.fsd.nyaysahayak.act_service.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ptu.fsd.nyaysahayak.act_service.model.Act;
import ptu.fsd.nyaysahayak.act_service.repository.ActRepo;

@Service
public class ActService {

	@Autowired
	private ActRepo repo;
	
	public Act saveAct(Act act) {
		return repo.save(act);
	}

	public List<Act> saveAct(List<Act>acts) {
		if(acts == null || acts.isEmpty())
			return new ArrayList<>();
		return repo.saveAll(acts);
	}
	
	public List<Act> getAllActs() {
	    return repo.findAll();
	}

    public Optional<Act> getActById(int id) {
        return repo.findById(id);  
    }

    public Act updateAct(int id, Act actDetails) {
        if (repo.existsById(id)) {
            actDetails.setId(id);
            return repo.save(actDetails);
        }
        return null;  
    }

    public void deleteAct(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
        }
    }
}
