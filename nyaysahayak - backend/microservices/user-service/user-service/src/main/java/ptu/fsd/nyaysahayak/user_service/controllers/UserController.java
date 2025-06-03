package ptu.fsd.nyaysahayak.user_service.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ptu.fsd.nyaysahayak.user_service.model.User;
import ptu.fsd.nyaysahayak.user_service.services.UserService;


@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService service;
	
	
	@PostMapping("/saveUser")
	public ResponseEntity<?> saveUser(@RequestBody User user){
		
		Optional <User> existingUser = service.checkUserByEmail(user.getEmail());
		
		if(existingUser.isPresent()) {
			System.out.println("User already exists!");
			return ResponseEntity.status(HttpStatus.OK).body("User with the same email already exists!");
		}
		
		User savedUser = service.saveUser(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	}
	
	@GetMapping("/getUser")
	public ResponseEntity<?> getUserData(@RequestParam String email){
		
		Optional <User> existingUser = service.checkUserByEmail(email);
		
		if(existingUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(existingUser.get());
		}
		
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with the provided email!");
	}
	
}
