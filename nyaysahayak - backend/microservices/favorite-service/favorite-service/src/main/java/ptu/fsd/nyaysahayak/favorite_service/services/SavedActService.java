package ptu.fsd.nyaysahayak.favorite_service.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import ptu.fsd.nyaysahayak.favorite_service.dto.ActDto;
import ptu.fsd.nyaysahayak.favorite_service.model.SavedAct;
import ptu.fsd.nyaysahayak.favorite_service.repository.SavedActRepo;

@Service
public class SavedActService {

	
	@Autowired
	private SavedActRepo repo;
	
	private WebClient webClient;
	
	 public SavedActService(@Value("${acts.service.url}") String actServiceUrl, @LoadBalanced WebClient.Builder webClientBuilder) {
	        this.webClient = webClientBuilder.baseUrl(actServiceUrl).build();
	    }

	
	@Value("${acts.service.url}")
	private String actServiceUrl;
	
	
	public SavedAct saveActForUser (String email, String userFirstName, int actId) {
	
		
		Optional <SavedAct> existing = repo.findByUserEmailAndActId(email, actId);
		
		if(existing.isPresent()) {
			throw new RuntimeException("Act already saved by the user!");
		}
		
		ActDto act = getActsFromActService(actId);
		
		if(act == null) {
			throw new RuntimeException("Act not found!");
		}
		
		
		SavedAct savedAct = new SavedAct();
		savedAct.setUserEmail(email);
		savedAct.setUserFirstName(userFirstName);
		savedAct.setActId(actId);
		savedAct.setTitle(act.getTitle());
		savedAct.setSummary(act.getSummary());
		savedAct.setImpact(act.getImpact());
		savedAct.setPenalties(act.getPenalties());
		
		return repo.save(savedAct);
	}
	
	
	public ActDto getActsFromActService(int actId) {
		
		try {
			return webClient.get()
						.uri("/api/acts/{id}", actId)
						.retrieve()
						.bodyToMono(ActDto.class)
						.block();
			
		}catch(WebClientResponseException ex) {
			throw new RuntimeException("Failed to fetch the act from the Acts service! Status Code: -"+ ex.getStatusCode(), ex);
		}catch(Exception ex) {
			throw new RuntimeException("Failed to fetch the act from the Acts service!", ex);
		}
	}
	
	
	public List<SavedAct> getSavedActsByUser(String email){	
			return repo.findByUserEmailOrderBySavedAtDesc(email);
	}
	
	@Transactional
	public Boolean removeSavedAct(String email, int actId){
		
		Optional<SavedAct> savedAct = repo.findByUserEmailAndActId(email, actId);
		
		if(savedAct.isPresent()) {			
			repo.deleteByUserEmailAndActId(email, actId);
			return true;
		}
		
		return false;
	}
	
	public boolean isActSavedByUser(String email, int actId) {
	
		return repo.findByUserEmailAndActId(email, actId).isPresent();
	}
	
	public long getSavedActsCountByUser(String email) {
		return repo.countByUserEmail(email);
	}
	
}
