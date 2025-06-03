package ptu.fsd.nyaysahayak.favorite_service.dto;

public class ActDto {

	private int id;
    private String title;
    private String summary;
    private String impact;
    private String penalties;
    
    // Constructors
    public ActDto() {}
    
    public ActDto(int id, String title, String summary, String impact, String penalties) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.impact = impact;
        this.penalties = penalties;
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
    
    public String getImpact() {
        return impact;
    }
    
    public void setImpact(String impact) {
        this.impact = impact;
    }
    
    public String getPenalties() {
        return penalties;
    }
    
    public void setPenalties(String penalties) {
        this.penalties = penalties;
    }
}
