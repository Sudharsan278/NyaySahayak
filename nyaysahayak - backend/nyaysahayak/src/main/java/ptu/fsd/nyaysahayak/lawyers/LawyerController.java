package ptu.fsd.nyaysahayak.lawyers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lawyers")
public class LawyerController {

    @Autowired
    private LawyerRepo lawyerRepo;

    @GetMapping
    public List<Lawyer> getAllLawyers() {
        return lawyerRepo.findAll();
    }
    
    @PostMapping
    public Lawyer addLawyer(@RequestBody Lawyer lawyer) {
        return (Lawyer) lawyerRepo.save(lawyer);
    }
}
