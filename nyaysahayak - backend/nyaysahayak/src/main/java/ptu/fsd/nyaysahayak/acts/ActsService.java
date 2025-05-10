package ptu.fsd.nyaysahayak.acts;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActsService {

    @Autowired
    private ActsRepo repo;
    
    public Acts saveAct(Acts act) {
        return repo.save(act);
    }
    
    public List<Acts> getAllActs() {
        return repo.findAll();
    }

    public Optional<Acts> getActById(int id) {
        return repo.findById(id);  
    }

    public Acts updateAct(int id, Acts actDetails) {
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
