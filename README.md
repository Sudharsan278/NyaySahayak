# NyaySahayak 🏛️

An AI-powered web application that democratizes legal assistance by providing intelligent legal advice, document analysis, and educational resources for the Indian legal system.

## 🚀 Features

- **AI-Powered Legal Advice**: Get intelligent responses to your legal queries
- **Document Understanding**: Upload and analyze legal documents with AI assistance
- **Free Lawyer Consultation**: Connect with qualified lawyers for professional advice
- **Indian Constitutional Acts**: Comprehensive database of Indian constitutional acts and legal information
- **Multi-language Support**: Translate document summaries to regional languages
- **Text-to-Speech**: Audio playback of document summaries and legal information
- **User-friendly Interface**: Intuitive design for easy navigation and accessibility

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces

### Backend
- **Spring Boot** - Java-based framework for robust backend services
- **Microservices Architecture** - Scalable and maintainable service structure
- **Docker** - Containerized deployment for easy setup and scaling

### AI Integration
- **Sarvam AI** - Advanced AI capabilities for legal analysis
- **Groq** - High-performance AI inference for fast responses


## 📚 Usage

1. **Legal Consultation**: Ask legal questions and get AI-powered responses
2. **Document Analysis**: Upload legal documents for AI-powered analysis and summarization
3. **Lawyer Consultation**: Schedule free consultations with qualified lawyers
4. **Constitutional Study**: Browse and study Indian constitutional acts and legal provisions
5. **Language Translation**: Translate summaries to your preferred regional language
6. **Audio Playback**: Listen to document summaries using text-to-speech functionality


## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Java 17** or higher
- **Maven**
- **Docker** and **Docker Compose**
- **Git**

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sudharsan278/NyaySahayak.git
cd NyaySahayak
```

### 2. API Keys Configuration

⚠️ **Important**: You must configure API keys before running the application.

Create environment files and add your API keys:


### 3. Running with Docker (Recommended)

The application is fully dockerized for easy deployment:

```bash
# Navigate to the microservices directory
cd nyaysahayak-backend/microservices

# Build and run all services
docker-compose up --build
```

This will start all backend microservices with their dependencies.

### 4. Running the Frontend

In a new terminal window:

```bash
# Navigate to frontend directory
cd nyaysahayak

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔧 Manual Setup (Alternative)

If you prefer to run services individually without Docker:

### Backend Setup
```bash
# Navigate to the main Spring Boot application directory
cd nyaysahayak-backend/nyaysahayak

# Install dependencies and run the application
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd nyaysahayak

# Install dependencies
npm install

# Start the development server
npm run dev
```
