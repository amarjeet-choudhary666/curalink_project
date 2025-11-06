# CuraLink

A comprehensive healthcare platform that bridges the gap between patients and medical researchers, fostering collaboration, knowledge sharing, and advancing medical research through innovative technology.

## 🚀 Features

### For Patients
- **Personal Health Profiles**: Create and manage detailed patient profiles with medical history
- **Clinical Trial Discovery**: Browse and explore relevant clinical trials
- **Publication Access**: Read and engage with medical research publications
- **Community Engagement**: Join patient communities for support and information sharing
- **Researcher Connections**: Request meetings with medical researchers
- **Favorites System**: Save and organize important trials, publications, and posts
- **Meeting Requests**: Schedule consultations with healthcare professionals

### For Researchers
- **Researcher Profiles**: Showcase expertise, publications, and ongoing research
- **Clinical Trial Management**: Create, update, and manage clinical trials
- **Publication Sharing**: Publish and share research findings
- **Community Leadership**: Create and moderate research communities
- **Patient Collaboration**: Respond to meeting requests and collaborate with patients
- **Data Analytics**: Access insights through integrated AI assistance

### Platform Features
- **AI-Powered Assistance**: Integrated Google Gemini AI for research insights and recommendations
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Real-time Communication**: Community forums with posts and replies
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Data Security**: Encrypted data storage with secure API endpoints

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM with PostgreSQL
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Google Generative AI** - AI-powered features
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** with **TypeScript** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Database
- **PostgreSQL** with **Prisma ORM**
- **Neon Database** - Serverless PostgreSQL

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account for cloud database)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd humanity_founder_project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**

   Create `.env` files in both backend and frontend directories.

   **Backend (.env)**
   ```env
   DATABASE_URL="your-database-connection-string"
   JWT_SECRET="your-jwt-secret"
   GOOGLE_AI_API_KEY="your-google-ai-api-key"
   PORT=8000
   ```

   **Frontend (.env)**
   ```env
   VITE_API_BASE_URL="http://localhost:8000/api"
   ```

5. **Database Setup**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Start Development Servers**

   **Backend:**
   ```bash
   npm run dev
   ```

   **Frontend:**
   ```bash
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173 or http://localhost:5174
   - Backend API: http://localhost:8000

## 📖 Usage

### User Registration and Authentication
1. Register as either a Patient or Researcher
2. Complete your profile setup
3. Access role-specific features

### API Endpoints

The API provides RESTful endpoints for all platform features:

- **Users**: `/api/users`
- **Patient Profiles**: `/api/patient-profiles`
- **Researcher Profiles**: `/api/researcher-profiles`
- **Clinical Trials**: `/api/clinical-trials`
- **Publications**: `/api/publications`
- **Communities**: `/api/communities`
- **Posts**: `/api/posts`
- **Replies**: `/api/replies`
- **Favorites**: `/api/favorites`
- **Meeting Requests**: `/api/meeting-requests`
- **Connections**: `/api/connections`

### Health Check
- GET `/health` - Check API status

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend linting
cd frontend
npm run lint
```

## 📦 Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, please contact the development team or create an issue in the repository.

## 🔄 Future Enhancements

- [ ] Real-time notifications
- [ ] Video consultation integration
- [ ] Advanced AI diagnostics
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Integration with medical devices
- [ ] Advanced analytics dashboard