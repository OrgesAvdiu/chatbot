# AI Chatbot Application

A full-stack AI chatbot application featuring Django REST Framework backend with OpenAI integration and Next.js frontend.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│            (http://localhost:3000)                          │
│  - Real-time chat UI with Tailwind CSS                     │
│  - Message history display                                  │
│  - Responsive design                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls (JSON)
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Django REST Framework Backend                   │
│            (http://localhost:8000/api)                      │
│  - Message storage (SQLite)                                 │
│  - OpenAI integration (gpt-4o-mini)                         │
│  - CORS configuration                                       │
│  - REST API endpoints                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
    SQLite DB            OpenAI API
    (Chat History)       (AI Responses)
```

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip, npm

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy the template and add your OpenAI API key:
# DJANGO_SECRET_KEY=your-secret-key
# DJANGO_DEBUG=True
# DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
# CORS_ALLOWED_ORIGINS=http://localhost:3000
# OPENAI_API_KEY=your-openai-api-key

# Run migrations
python manage.py migrate

# Start server (runs on http://localhost:8000)
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend-next

# Install dependencies
npm install

# Create .env.local file:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Start development server (runs on http://localhost:3000)
npm run dev
```

## API Endpoints

### Messages
- **GET** `/api/messages/` - Retrieve all chat messages

### Chat
- **POST** `/api/chat/` - Send a message and get AI response

## Project Structure

```
chatbot/
├── backend/                    # Django application
│   ├── chatbot_config/         # Project settings
│   ├── chat/                   # Chat app
│   │   ├── models.py           # Message model
│   │   ├── views.py            # API views
│   │   ├── serializers.py       # DRF serializers
│   │   ├── urls.py             # URL routing
│   │   └── migrations/          # Database migrations
│   ├── .env                    # Environment variables (git ignored)
│   ├── .gitignore              # Git ignore file
│   ├── requirements.txt         # Python dependencies
│   ├── manage.py               # Django CLI
│   └── README.md               # Backend documentation
│
├── frontend-next/              # Next.js application
│   ├── app/
│   │   ├── components/
│   │   │   └── ChatContainer.tsx  # Main chat component
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── .env.local              # Environment variables (git ignored)
│   ├── .gitignore              # Git ignore file
│   ├── package.json            # Node dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.ts       # Tailwind config
│   ├── next.config.ts          # Next.js config
│   └── README.md               # Frontend documentation
│
└── README.md                   # This file
```

## Database Schema

### Message Model
```
- id: INTEGER (Primary Key)
- role: VARCHAR(10) ['user', 'assistant']
- text: TEXT
- created: DATETIME (auto-generated)
```

## Key Features

### Backend
- ✅ Django MVT architecture
- ✅ RESTful API with DRF
- ✅ OpenAI gpt-4o-mini integration
- ✅ SQLite database
- ✅ CORS support
- ✅ Environment-based configuration
- ✅ Automatic message persistence
- ✅ Chat history loading

### Frontend
- ✅ Real-time chat interface
- ✅ Next.js App Router
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Responsive mobile design
- ✅ Message history display
- ✅ Auto-scroll to latest message
- ✅ Loading states
- ✅ Optimistic updates
- ✅ Error handling

## Security Considerations

1. **Environment Variables**: All secrets stored in `.env` and `.env.local` (git ignored)
2. **CORS**: Restricted to specified origins only
3. **API Key**: OpenAI key loaded securely from environment
4. **Debug Mode**: Set to False in production
5. **Secret Key**: Generate strong secret key for production

## Development Workflow

1. Start the Django backend server
2. Start the Next.js frontend development server
3. Open http://localhost:3000 in your browser
4. Type messages to interact with the AI assistant
5. Messages are automatically saved to the database

## System Prompt

The AI assistant is configured with a system prompt specializing in:
- Technology and computer science
- Programming concepts and languages
- Web and backend development
- Databases and system design
- APIs and architectures
- DevOps and cloud computing

## Troubleshooting

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`
- Check that the backend server is running on `http://localhost:8000`

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is correctly set in `.env`
- Check that the API key is valid and has available credits

### Database Errors
- Run migrations: `python manage.py migrate`
- Delete `db.sqlite3` and re-migrate if needed

### Connection Refused
- Ensure backend is running: `python manage.py runserver`
- Ensure frontend can reach backend at the configured API URL

## Production Deployment

### Backend (Django)
- Use environment-specific `.env` files
- Set `DJANGO_DEBUG=False`
- Use production-grade database (PostgreSQL recommended)
- Configure proper `ALLOWED_HOSTS`
- Use HTTPS with secure CORS settings

### Frontend (Next.js)
- Run `npm run build` to create optimized production build
- Deploy to Vercel, Netlify, or similar
- Update `NEXT_PUBLIC_API_BASE_URL` to production backend URL

## Technologies Used

**Backend:**
- Django 5.1.3
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- OpenAI 1.3.0
- Python-dotenv 1.0.0

**Frontend:**
- Next.js 15+
- React 19+
- TypeScript
- Tailwind CSS

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions:
1. Check the backend README.md
2. Check the frontend README.md
3. Verify environment variables are correctly set
4. Check network connectivity between frontend and backend
