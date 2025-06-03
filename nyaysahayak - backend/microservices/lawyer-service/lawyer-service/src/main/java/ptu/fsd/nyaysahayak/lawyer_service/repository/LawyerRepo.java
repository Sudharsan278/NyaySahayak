package ptu.fsd.nyaysahayak.lawyer_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ptu.fsd.nyaysahayak.lawyer_service.model.Lawyer;

public interface LawyerRepo extends JpaRepository<Lawyer, Integer>{

}
