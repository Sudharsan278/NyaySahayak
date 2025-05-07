package ptu.fsd.nyaysahayak.users;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
	
	@Autowired
	private UserRepo repo;
	
	public Users saveUser(Users newUser) {

		return repo.save(newUser);
	}
	
	public Optional<Users> checkUserByEmail(String email) {
		return repo.findByEmail(email).isPresent() ? repo.findByEmail(email) : Optional.empty();
	}
	
}
