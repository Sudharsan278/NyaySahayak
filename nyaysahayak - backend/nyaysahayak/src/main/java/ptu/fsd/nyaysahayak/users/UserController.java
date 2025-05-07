package ptu.fsd.nyaysahayak.users;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	
	@Autowired
	private UsersService service;
	
	
	
	@PostMapping("/saveUser")
	public ResponseEntity<?> saveUser(@RequestBody Users user){
		
		Optional <Users> existingUser = service.checkUserByEmail(user.getEmail());
		
		if(existingUser.isPresent()) {
			System.out.println("User already exists!");
			return ResponseEntity.status(HttpStatus.OK).body("User with the same email already exists!");
		}
		
		Users savedUser = service.saveUser(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	}
	
	@GetMapping("/getData")
	public ResponseEntity<?> getUserData(@RequestParam String email){
		
		Optional <Users> existingUser = service.checkUserByEmail(email);
		
		if(existingUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(existingUser.get());
		}
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with the provided email!");
	}
	
}