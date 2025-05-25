package ptu.fsd.nyaysahayak.groq;

import java.util.ArrayList;
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
    
    
    @PostMapping("/get-advice")
    public Mono<Map> getLegalAdvice(@RequestBody Map<String, Object> request) {
        try {
            // Extract query and category from request
            String query = (String) request.get("query");
            String category = (String) request.get("category");
            
            if (query == null || query.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Query is required");
                return Mono.just(errorResponse);
            }

            // Create system prompt based on category
            String systemPrompt = createSystemPrompt(category);
            
            // Create enhanced user prompt
            String enhancedUserPrompt = createEnhancedUserPrompt(query, category);
            
            // Create messages list for Groq API
            List<Map<String, String>> messages = new ArrayList<>();
            
            // Add system message
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", systemPrompt);
            messages.add(systemMessage);
            
            // Add user message
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", enhancedUserPrompt);
            messages.add(userMessage);
            
            // Create request payload for Groq API
            Map<String, Object> groqRequest = new HashMap<>();
            groqRequest.put("messages", messages);
            groqRequest.put("model", "llama3-8b-8192"); // You can configure this
            groqRequest.put("temperature", 0.3);
            groqRequest.put("max_tokens", 1000);
            groqRequest.put("stream", false);
            
            return webClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(groqRequest)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(this::processGroqResponse);
                    
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to process legal advice request: " + e.getMessage());
            return Mono.just(errorResponse);
        }
    }
    
    private String createSystemPrompt(String category) {
        String basePrompt = "You are an experienced legal advisor specializing in Indian law. " +
                "Provide helpful, accurate, and practical legal guidance while always emphasizing " +
                "that this is general information and not a substitute for professional legal advice. " +
                "Always recommend consulting with a qualified attorney for specific legal matters.";
        
        if (category != null && !category.isEmpty()) {
            switch (category.toLowerCase()) {
                case "family":
                    return basePrompt + " Focus on family law matters including marriage, divorce, " +
                           "child custody, adoption, and domestic relations under Indian law.";
                case "property":
                    return basePrompt + " Focus on property law including real estate transactions, " +
                           "property disputes, land records, and property rights under Indian law.";
                case "criminal":
                    return basePrompt + " Focus on criminal law matters including FIRs, bail procedures, " +
                           "criminal defense, and rights of accused under Indian Penal Code.";
                case "civil":
                    return basePrompt + " Focus on civil law matters including contracts, torts, " +
                           "civil disputes, and civil procedure under Indian law.";
                case "consumer":
                    return basePrompt + " Focus on consumer rights, product liability, service deficiencies, " +
                           "and remedies under Consumer Protection Act, 2019.";
                case "employment":
                    return basePrompt + " Focus on employment law including labor rights, workplace disputes, " +
                           "termination, and employment contracts under Indian labor laws.";
                default:
                    return basePrompt;
            }
        }
        return basePrompt;
    }
    
    private String createEnhancedUserPrompt(String query, String category) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Legal Query");
        
        if (category != null && !category.isEmpty()) {
            prompt.append(" (").append(category.toUpperCase()).append(" LAW)");
        }
        
        prompt.append(":\n").append(query);
        prompt.append("\n\nPlease provide your response in a clear, structured format using the following sections:\n\n");
        prompt.append("1. LEGAL GUIDANCE: Provide clear, practical advice in simple language\n\n");
        prompt.append("2. RELEVANT LEGAL PROVISIONS: List applicable laws, sections, or acts\n\n");
        prompt.append("3. NEXT STEPS: Suggest concrete actions the person can take\n\n");
        prompt.append("4. IMPORTANT DISCLAIMER: Remind about professional legal consultation\n\n");
        prompt.append("IMPORTANT: Do not use markdown formatting like ** or # or any other markdown syntax. ");
        prompt.append("Use plain text only with clear section headings and numbered points where needed. ");
        prompt.append("Keep the language simple and accessible for non-lawyers. ");
        prompt.append("Write in a conversational tone as if explaining to a friend.");
        
        return prompt.toString();
    }
    
    private Map<String, Object> processGroqResponse(Map<String, Object> groqResponse) {
        Map<String, Object> processedResponse = new HashMap<>();
        
        try {
            // Extract the AI response from Groq API response
            Map<String, Object> choices = (Map<String, Object>) ((List) groqResponse.get("choices")).get(0);
            Map<String, Object> message = (Map<String, Object>) choices.get("message");
            String content = (String) message.get("content");
            
            // Parse the structured response
            processedResponse.put("success", true);
            processedResponse.put("answer", content);
            
            // Extract legal references if present in the response
            List<String> references = extractLegalReferences(content);
            if (!references.isEmpty()) {
                processedResponse.put("references", references);
            }
            
            // Add usage information if available
            if (groqResponse.containsKey("usage")) {
                processedResponse.put("usage", groqResponse.get("usage"));
            }
            
        } catch (Exception e) {
            processedResponse.put("success", false);
            processedResponse.put("error", "Failed to process AI response: " + e.getMessage());
            processedResponse.put("answer", "I apologize, but I encountered an error while processing your legal query. " +
                    "Please try again or consult with a qualified attorney for assistance.");
        }
        
        return processedResponse;
    }
    
    private List<String> extractLegalReferences(String content) {
        List<String> references = new ArrayList<>();
        
        // Simple regex patterns to extract common legal references
        String[] patterns = {
            "Section \\d+[A-Za-z]* of [^\\n\\.]+",
            "Article \\d+[A-Za-z]* of [^\\n\\.]+",
            "[A-Za-z\\s]+ Act,? \\d{4}",
            "IPC Section \\d+[A-Za-z]*",
            "CrPC Section \\d+[A-Za-z]*",
            "CPC Section \\d+[A-Za-z]*"
        };
        
        for (String pattern : patterns) {
            java.util.regex.Pattern compiledPattern = java.util.regex.Pattern.compile(pattern);
            java.util.regex.Matcher matcher = compiledPattern.matcher(content);
            while (matcher.find() && references.size() < 5) { // Limit to 5 references
                String reference = matcher.group().trim();
                if (!references.contains(reference)) {
                    references.add(reference);
                }
            }
        }
        
        return references;
    }
    
    @PostMapping("/categories")
    public Mono<Map<String, Object>> getLegalCategories() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, String>> categories = new ArrayList<>();
        
        categories.add(createCategory("family", "Family Law", "Marriage, divorce, child custody, adoption"));
        categories.add(createCategory("property", "Property Law", "Real estate, land disputes, property rights"));
        categories.add(createCategory("criminal", "Criminal Law", "FIR, bail, criminal defense, IPC matters"));
        categories.add(createCategory("civil", "Civil Law", "Contracts, torts, civil disputes"));
        categories.add(createCategory("consumer", "Consumer Rights", "Product issues, service deficiencies"));
        categories.add(createCategory("employment", "Employment Law", "Labor rights, workplace disputes"));
        categories.add(createCategory("other", "Other", "General legal matters"));
        
        response.put("categories", categories);
        response.put("success", true);
        
        return Mono.just(response);
    }
    
    private Map<String, String> createCategory(String value, String name, String description) {
        Map<String, String> category = new HashMap<>();
        category.put("value", value);
        category.put("name", name);
        category.put("description", description);
        return category;
    }
}