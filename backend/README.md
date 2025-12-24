# AI Chatbot Backend

A Django REST Framework application with OpenAI integration for intelligent chat functionality.

## Features

- **Chat API**: Real-time messaging with OpenAI's gpt-4o-mini model
- **Message Storage**: SQLite database for persistent chat history
- **REST API**: RESTful endpoints for message management
- **CORS Support**: Secure cross-origin requests from Next.js frontend
- **Environment Configuration**: Secure .env-based configuration

## Setup

### Prerequisites
- Python 3.10+
- pip

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file with required variables:
```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api`

## API Endpoints

### GET /api/messages/
Returns all chat messages ordered by creation time.

**Response:**
```json
[
  {
    "id": 1,
    "role": "user",
    "text": "Hello, how are you?",
    "created": "2024-12-24T10:00:00Z"
  },
  {
    "id": 2,
    "role": "assistant",
    "text": "I'm doing well, thank you for asking!",
    "created": "2024-12-24T10:00:05Z"
  }
]
```

### POST /api/chat/
Sends a user message and receives an AI response.

**Request:**
```json
{
  "message": "What is Python?"
}
```

**Response:**
```json
{
  "response": "Python is a high-level programming language..."
}
```

## Database Schema

### Message Model
- `id`: Auto-incrementing primary key
- `role`: CharField (choices: 'user', 'assistant')
- `text`: TextField containing message content
- `created`: DateTimeField (auto-generated timestamp)

## Security

- All sensitive configuration is stored in `.env`
- `.env` file is ignored by git
- CORS is configured to only allow specified origins
- OpenAI API key is securely loaded from environment variables

## Development Notes

- The application uses SQLite for development
- Django migrations are included in version control
- API endpoints are versioned under `/api/`
- Real-time chat history is maintained in the database
