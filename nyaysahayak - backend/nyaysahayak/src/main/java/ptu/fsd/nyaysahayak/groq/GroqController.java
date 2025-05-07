package ptu.fsd.nyaysahayak.groq;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/groq")
@CrossOrigin(origins = "http://localhost:5173")
public class GroqController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GroqController(WebClient.Builder builder, 
                          @Value("${groq.api.key}") String groqApiKey) {
        this.webClient = builder
                .baseUrl("https://api.groq.com/openai/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + groqApiKey)
                .build();
        this.objectMapper = new ObjectMapper();
        
        System.out.println("Groq controller initialized");
    }

    @PostMapping("/summarize")
    public Mono<Map> chatWithGroq(@RequestBody Map<String, Object> request) {
        // Make sure streaming is disabled for this endpoint
        if (request.containsKey("stream")) {
            request.put("stream", false);
        }
        
        List<Map<String, String>> messages = (List<Map<String, String>>) request.get("messages");

        if (messages != null && !messages.isEmpty()) {
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "Check whether the following is a legal document or not. "
                    + "If it is, summarize it briefly. If it is not, inform the user that it does not appear to be a legal document and suggest verifying the input.");

            // Add system message at the beginning of the list
            messages.add(0, systemMessage);
        }

        
        return webClient.post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class);
    }
    
    @PostMapping("/analyze")
    public Mono<Map> analyzeLegalDocument(@RequestBody Map<String, Object> request) {
        // Create a new request object with the legal document analysis prompt
        Map<String, Object> analysisRequest = new HashMap<>(request);
        
        if (analysisRequest.containsKey("messages") && analysisRequest.get("messages") instanceof java.util.List) {
            java.util.List<Map<String, Object>> messages = (java.util.List<Map<String, Object>>) analysisRequest.get("messages");
            
            if (!messages.isEmpty()) {
                // Get the original user message content
                String userContent = (String) messages.get(0).get("content");
                
                // Create an enhanced prompt with the analysis instructions
                String enhancedPrompt = "You are a legal document analysis expert. Analyze the provided document comprehensively " +
                    "and structure your response with the following sections:\n\n" +
                    "1. SUMMARY: A concise summary of the document in 2-3 sentences.\n" +
                    "2. DOCUMENT TYPE: Identify what kind of legal document this is.\n" +
                    "3. KEY PARTIES: List and briefly describe all relevant parties mentioned.\n" +
                    "4. KEY PROVISIONS: Identify the main clauses or provisions.\n" +
                    "5. LEGAL IMPLICATIONS: Explain potential legal consequences or implications.\n" +
                    "6. RECOMMENDATIONS: Provide actionable advice regarding this document.\n" +
                    "7. RED FLAGS: Highlight any concerning elements requiring special attention.\n\n" +
                    "8. EXAMPLES: Provide any suitable examples if possible so that it is more easier to understand\n" +
                    "Format each section with headers and clear points in a very detailed manner. Remember that your response should be in such a way that.\n\n" +
                    "it is easier to understand even if the person doesn't know nothing about it"+
                    "Also attach any real time incident that is similar to this"+
                    "All the headings that i have mentioned should be in bold and the remaining in a normal text format"+
                    "Document to analyze: " + userContent;
                
                // Replace the original message with the enhanced prompt
                messages.get(0).put("content", enhancedPrompt);
                analysisRequest.put("messages", messages);
            }
        }
        
        // Make sure streaming is disabled for this endpoint
        if (analysisRequest.containsKey("stream")) {
            analysisRequest.put("stream", false);
        }

        return webClient.post()
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(analysisRequest)
            .retrieve()
            .bodyToMono(Map.class);
    }
}