package ptu.fsd.nyaysahayak.users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users, Integer>{
	
	Optional <Users> findByEmail(String email);
}
