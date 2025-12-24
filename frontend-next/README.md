# AI Chatbot Frontend

A Next.js application with real-time chat interface for AI-powered conversations.

## Features

- **Real-time Chat**: Responsive chat interface with instant message updates
- **Message History**: Loads full chat history on page load
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Auto-scroll**: Automatically scrolls to latest messages
- **Loading States**: User feedback during message sending

## Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend-next
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend-next/
├── app/
│   ├── components/
│   │   └── ChatContainer.tsx     # Main chat UI component
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── .env.local                      # Environment variables
└── package.json                    # Dependencies
```

## Components

### ChatContainer.tsx
Main chat interface component with the following features:

- **Message Display**: Renders user and assistant messages with different styling
- **Input Form**: Textarea with send button
- **Loading States**: Shows loading state while waiting for responses
- **Timestamps**: Displays message creation time
- **Optimistic Updates**: Adds user message immediately before server response
- **Auto-scroll**: Scrolls to latest messages automatically

## Data Flow

1. **Page Load**: 
   - `useEffect` fetches all messages from `/api/messages/`
   - Messages are displayed in chat history

2. **Send Message**:
   - User types message and submits form
   - User message is added to UI optimistically
   - POST request sent to `/api/chat/`
   - Server processes with OpenAI and saves both messages
   - Assistant response is displayed

3. **Error Handling**:
   - Failed messages are removed from UI
   - Errors are logged to console
   - User can retry

## API Integration

- **Base URL**: `http://localhost:8000/api` (from `.env.local`)
- **GET /messages/**: Fetch all messages
- **POST /chat/**: Send new message and get response

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Mobile-first design
- **Color Scheme**:
  - User messages: Blue background
  - Assistant messages: Gray background
  - Input bar: White with blue accents

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```
