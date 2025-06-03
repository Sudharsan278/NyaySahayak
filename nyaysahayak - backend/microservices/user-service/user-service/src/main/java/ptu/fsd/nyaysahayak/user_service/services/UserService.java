package ptu.fsd.nyaysahayak.user_service.services;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ptu.fsd.nyaysahayak.user_service.model.User;
import ptu.fsd.nyaysahayak.user_service.repository.UserRepo;


@Service
public class UserService {

	@Autowired
	private UserRepo repo;
	
	public User saveUser(User newUser) {

		return repo.save(newUser);
	}
	
	public Optional<User> checkUserByEmail(String email) {
		return repo.findByEmail(email).isPresent() ? repo.findByEmail(email) : Optional.empty();
	}
}
