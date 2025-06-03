package ptu.fsd.nyaysahayak.user_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ptu.fsd.nyaysahayak.user_service.model.User;

public interface UserRepo extends JpaRepository<User, Integer> {

	Optional <User> findByEmail(String email);
}
