import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import AuthProvider from './components/AuthProvider';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import MobileNav from './components/MobileNav';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PatientOnboarding = React.lazy(() => import('./pages/PatientOnboarding'));
const ResearcherOnboarding = React.lazy(() => import('./pages/ResearcherOnboarding'));
const HealthExperts = React.lazy(() => import('./pages/HealthExperts'));
const Collaborators = React.lazy(() => import('./pages/Collaborators'));
const ClinicalTrialsList = React.lazy(() => import('./pages/ClinicalTrialsList'));
const ClinicalTrialDetail = React.lazy(() => import('./pages/ClinicalTrialDetail'));
const PublicationsList = React.lazy(() => import('./pages/PublicationsList'));
const PublicationDetail = React.lazy(() => import('./pages/PublicationDetail'));
const CommunitiesList = React.lazy(() => import('./pages/CommunitiesList'));
const CommunityDetail = React.lazy(() => import('./pages/CommunityDetail'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const CreatePostForm = React.lazy(() => import('./components/CreatePostForm'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const RequestMeeting = React.lazy(() => import('./pages/RequestMeeting'));
const ManageMeetingRequests = React.lazy(() => import('./pages/ManageMeetingRequests'));
const MyMeetingRequests = React.lazy(() => import('./pages/MyMeetingRequests'));
const AddClinicalTrial = React.lazy(() => import('./pages/AddClinicalTrial'));
const AddPublication = React.lazy(() => import('./pages/AddPublication'));
const CreateCommunity = React.lazy(() => import('./pages/CreateCommunity'));

import './App.css';

function App() {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { isAuthenticated, user, isLoading } = authState;
  const userRole = user?.role?.toLowerCase() || '';

  // Show loading spinner while initializing auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-background font-poppins">
          <Header />
          <div className="flex flex-1 pt-20">
            <Sidebar />
            <main
              className="flex-1 bg-background pb-20 md:pb-0"
              role="main"
            >
              <div className="container mx-auto px-4 py-6 max-w-7xl">
                <Suspense fallback={
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                    <div className="text-center">
                      <LoadingSpinner size="lg" />
                      <p className="mt-4 text-slate-600">Loading page...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/onboarding/patient" element={<PatientOnboarding />} />
                  <Route path="/onboarding/researcher" element={<ResearcherOnboarding />} />
                  <Route path="/experts" element={<HealthExperts />} />
                  <Route path="/collaborators" element={<Collaborators />} />
                  
                  {/* Public access for demo */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clinical-trials" element={<ClinicalTrialsList />} />
                  <Route path="/publications" element={<PublicationsList />} />
                  <Route path="/community" element={<CommunitiesList />} />
                  <Route path="/favorites" element={<Favorites />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Role-based Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <Profile />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/clinical-trials"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <ClinicalTrialsList />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/clinical-trials/:id"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <ClinicalTrialDetail />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/publications"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <PublicationsList />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/publications/:id"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <PublicationDetail />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/community"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <CommunitiesList />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/community/:slug"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <CommunityDetail />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/community/:slug/create-post"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <CreatePostForm />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/post/:id"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <PostDetail />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/favorites"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <Favorites />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/request-meeting/:researcherId"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient']} userRole={userRole}>
                          <RequestMeeting />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/manage-meeting-requests"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['researcher']} userRole={userRole}>
                          <ManageMeetingRequests />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-meeting-requests"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <MyMeetingRequests />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/clinical-trials/add"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['researcher']} userRole={userRole}>
                          <AddClinicalTrial />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/publications/add"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['researcher']} userRole={userRole}>
                          <AddPublication />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/communities/create"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RoleGuard allowedRoles={['patient', 'researcher']} userRole={userRole}>
                          <CreateCommunity />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
          <Footer />
          <ScrollToTop />
          <MobileNav />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
