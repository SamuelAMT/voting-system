# 🚀 Feature Voting System

A full-stack feature voting application with web and mobile interfaces, built with Node.js, React, React Native, and PostgreSQL.

## 📋 Features

- **Submit Feature Requests**: Users can suggest new features with titles and descriptions
- **Vote on Features**: Upvote features you'd like to see implemented
- **Real-time Updates**: Vote counts update immediately across all clients
- **Duplicate Prevention**: IP-based voting to prevent spam
- **Rate Limiting**: API protection against abuse
- **Cross-platform**: Web app and native mobile app
- **Responsive Design**: Works on desktop, tablet, and mobile browsers

## 🏗️ Architecture

- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL (Neon recommended)
- **Web Frontend**: React + TypeScript
- **Mobile App**: React Native + TypeScript
- **API**: RESTful API with comprehensive error handling

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon account recommended)
- For mobile development: React Native CLI, Xcode (iOS), or Android Studio

### 1. Clone and Setup

```bash
git clone <repository-url>
cd feature-voting-system

# Install root dependencies
npm install
```

### 2. Database Setup

1. Create a Neon PostgreSQL database at https://neon.tech
2. Copy the connection string
3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database URL and other settings
```

### 3. Backend Setup

```bash
cd backend
npm install

# Set up Prisma
npx prisma generate
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### 5. Mobile Setup (Optional)

```bash
cd mobile
npm install

# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/features` | List all features (sorted by votes) |
| POST | `/api/features` | Create a new feature request |
| POST | `/api/features/:id/vote` | Vote for a specific feature |
| GET | `/api/features/:id` | Get a single feature by ID |
| GET | `/health` | Health check endpoint |

## 📊 Database Schema

### Features Table
- `id`: Primary key (auto-increment)
- `title`: Feature title (required, max 255 chars)
- `description`: Detailed description (optional)
- `authorName`: Name of person suggesting (required, max 100 chars)
- `votes`: Current vote count (default 0)
- `created_at`, `updated_at`: Timestamps

### Votes Table
- `id`: Primary key
- `feature_id`: Foreign key to features
- `voter_ip`: IP address of voter
- `created_at`: Vote timestamp
- Unique constraint on (feature_id, voter_ip) prevents duplicate votes

## 🛠️ Development Scripts

### Backend
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start           # Start production server
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:studio   # Open Prisma Studio
```

### Frontend
```bash
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run eject       # Eject from Create React App
```

### Mobile
```bash
npm run android     # Run on Android
npm run ios         # Run on iOS
npm start           # Start Metro bundler
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS
- `NODE_ENV`: Environment (development/production)

#### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL

### Rate Limiting
- Voting: 10 votes per IP per 15 minutes
- Configurable in backend environment variables

## 📱 Mobile App Features

- Native iOS/Android interface
- Pull-to-refresh functionality
- Optimistic updates
- Native alerts and feedback
- Responsive design following platform guidelines

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables in hosting platform
2. Ensure DATABASE_URL points to production database
3. Run `npm run build` if applicable
4. Start with `npm start`

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Set `REACT_APP_API_URL` to production API URL
3. Deploy `build/` directory

### Database (Neon)
1. Create production database
2. Run `npx prisma db push` to create schema
3. Update connection string in backend environment

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create new feature request
- [ ] Vote on existing features
- [ ] Verify duplicate vote prevention
- [ ] Test rate limiting
- [ ] Check mobile responsiveness
- [ ] Verify error handling

### API Testing
```bash
# Test with curl
curl -X POST http://localhost:5000/api/features \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Feature","authorName":"Test User"}'

curl -X POST http://localhost:5000/api/features/1/vote
```

## 🛡️ Security Features

- IP-based duplicate vote prevention
- Rate limiting on voting endpoints
- Input validation and sanitization
- CORS configuration
- SQL injection prevention (Prisma ORM)
- XSS protection headers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check DATABASE_URL format
- Verify database is running and accessible
- Ensure SSL mode is correct for cloud databases

**CORS Errors**
- Verify FRONTEND_URL in backend .env
- Check that frontend is running on expected port

**Mobile App Won't Start**
- Run `npx react-native doctor` to diagnose issues
- Ensure simulators/emulators are set up correctly
- Clear Metro cache: `npx react-native start --reset-cache`

**Votes Not Working**
- Check browser console for API errors
- Verify rate limiting isn't blocking requests
- Check network tab in developer tools

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📞 Support

For issues and questions, please create an issue in the GitHub repository.