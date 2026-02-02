# Advocate Diary - Legal Case Management System

A comprehensive web application for advocates to manage their legal practice, including case management, hearing calendar, client directory, document management, and e-filing system.

## 🚀 Features

- **Dashboard**: Overview of cases, hearings, tasks, and clients with quick actions
- **Case Management**: Track all cases with detailed information, timeline, hearings, and documents
- **Digital Diary (Calendar)**: FullCalendar integration for managing hearing schedules
- **Client Directory**: Manage client information, associated cases, and invoices
- **E-Filing Mock**: Step-by-step wizard for electronic court filing simulation
- **Global Search**: Ctrl+K command palette for quick navigation across all entities
- **Authentication**: Firebase-based secure login and registration

## 🛠️ Tech Stack

### Frontend
- **React** 18 with **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Firebase Authentication**
- **FullCalendar** for calendar views
- **Fuse.js** for fuzzy search
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with **Express**
- **Supabase** PostgreSQL database
- **Firebase Admin** for token verification
- **CORS** enabled

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for authentication)
- Supabase project (for database)

## 🔧 Installation

### 1. Clone the repository
```bash
cd "c:\Users\dasso\OneDrive\Desktop\advocate diary"
```

### 2. Install Client Dependencies
```bash
cd client
npm install
```

### 3. Install Server Dependencies
```bash
cd ../server
npm install
```

## ⚙️ Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Copy your Firebase config

### Client Configuration

Create `client/.env` file:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

### Supabase Setup

1. Create a Supabase project at [Supabase](https://supabase.com/)
2. Run the SQL schema from `server/db/schema.sql` in the SQL Editor
3. Copy your Supabase URL and anon key

### Server Configuration

Create `server/.env` file:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
advocate-diary/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   └── package.json
│
├── server/                # Express backend
│   ├── db/               # Database config & schema
│   ├── middleware/       # Auth middleware
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
│
└── README.md
```

## 🔐 Authentication Flow

1. User registers with email, password, and Bar Council number
2. Firebase creates authentication account
3. Backend creates user profile in Supabase
4. User can login and access protected routes
5. All API calls include Firebase JWT token

## 📊 Database Schema

The application uses 7 main tables:
- **users**: Advocate profiles
- **cases**: Legal cases
- **clients**: Client information
- **hearings**: Scheduled hearings
- **documents**: Case documents
- **tasks**: Case-related tasks
- **invoices**: Client invoices

## 🎨 Key Features Explained

### Global Search (Ctrl+K)
- Press `Ctrl+K` anywhere in the app
- Search across cases, clients, hearings, and documents
- Fuzzy search powered by Fuse.js
- Categorized results with quick navigation

### Calendar Integration
- Month, Week, and Day views
- Color-coded events
- Drag-and-drop support
- Upcoming hearings sidebar
- Overdue items tracking

### E-Filing Mock
- Multi-step wizard interface
- Court selection
- Case details entry
- Document upload with validation
- Mock submission with reference ID

## 🚧 Demo Limitations

This is a **DEMO** application with the following mocked features:
- Bar Council verification (shows success)
- eCourts integration (manual data entry)
- E-filing submission (generates fake reference IDs)
- Payment gateway (shows success screen)
- SMS notifications (console logs only)

## 🔜 Future Enhancements

- Real eCourts API integration
- Actual payment gateway (Razorpay/Paytm)
- SMS notifications via Twilio/MSG91
- Bar Council SSO integration
- Document OCR and auto-fill
- Advanced analytics dashboard
- Team collaboration features
- Mobile app (React Native)

## 📝 License

This project is for demonstration purposes.

## 👨‍💻 Author

Built with ❤️ for the legal community

## 🐛 Troubleshooting

### Port already in use
If port 5000 or 5173 is already in use, change the port in:
- Server: `server/.env` → `PORT=5001`
- Client: `client/vite.config.js` → `server.port: 5174`

### Firebase authentication errors
- Ensure Firebase config is correct in `client/.env`
- Check that Email/Password auth is enabled in Firebase Console

### Supabase connection errors
- Verify Supabase URL and key in `server/.env`
- Ensure database schema is created from `schema.sql`

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

**Happy Case Management! ⚖️**
