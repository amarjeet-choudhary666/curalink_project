import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../store';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Initialize dashboard data
        const dashboardData: any = {
          userProfile: null,
          favorites: [],
          recentTrials: [],
          recentPublications: [],
        };

        // Fetch user profile data (optional)
        try {
          const userResult = await apiService.getUserById(user.id);
          if (userResult.success) {
            dashboardData.userProfile = userResult.data;
          }
        } catch (err) {
          console.warn('Failed to fetch user profile:', err);
        }

        // Fetch favorites (optional)
        try {
          const favoritesResult = await apiService.getUserFavorites(user.id);
          if (favoritesResult.success && favoritesResult.data) {
            dashboardData.favorites = {
              favoriteTrials: favoritesResult.data.trials || [],
              favoriteResearchers: favoritesResult.data.researchers || [],
              favoritePublications: favoritesResult.data.publications || []
            };
          }
        } catch (err) {
          console.warn('Failed to fetch favorites:', err);
        }

        // Fetch clinical trials (optional)
        try {
          const trialsResult = await apiService.listClinicalTrials({ limit: 5 });
          if (trialsResult.success) {
            dashboardData.recentTrials = trialsResult.data || [];
          }
        } catch (err) {
          console.warn('Failed to fetch clinical trials:', err);
        }

        // Fetch publications (optional)
        try {
          const publicationsResult = await apiService.listPublications({ limit: 5 });
          if (publicationsResult.success) {
            dashboardData.recentPublications = publicationsResult.data || [];
          }
        } catch (err) {
          console.warn('Failed to fetch publications:', err);
        }

        setDashboardData(dashboardData);
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        setDashboardData({
          userProfile: null,
          favorites: [],
          recentTrials: [],
          recentPublications: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isPatient = user?.role === 'PATIENT';
  const isResearcher = user?.role === 'RESEARCHER';

  // If not authenticated, show a demo message
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">CL</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to CuraLink</h2>
          <p className="text-slate-600 mb-6">Please log in to access your personalized dashboard</p>
          <Link 
            to="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-xl text-slate-600">
              {isPatient ? 'Find clinical trials and connect with health experts' : 'Manage your research and connect with patients'}
            </p>
          </div>
          
          {/* Test Button for Development */}
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/meeting-requests/test', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  const result = await response.json();
                  if (result.success) {
                    alert('Test meeting request created!');
                  } else {
                    alert('Failed to create test request: ' + result.message);
                  }
                } catch (error) {
                  alert('Error: ' + error);
                }
              }}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              🧪 Create Test Meeting Request
            </button>
            
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem('accessToken');
                  console.log('Dashboard test - Token:', token ? 'exists' : 'missing');
                  console.log('Dashboard test - User ID:', user?.id);
                  
                  const response = await fetch(`/api/meeting-requests/user/${user?.id}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  console.log('Dashboard test - Response status:', response.status);
                  const result = await response.json();
                  console.log('Dashboard test - Result:', result);
                  
                  if (response.ok) {
                    alert(`Found ${result.data?.meetingRequests?.length || 0} meeting requests. Check console for details.`);
                  } else {
                    alert(`Error ${response.status}: ${result.message || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('Dashboard test error:', error);
                  alert('Error: ' + error);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔍 Check My Requests
            </button>
            
            <button
              onClick={() => {
                const token = localStorage.getItem('accessToken');
                const user = localStorage.getItem('user');
                console.log('Auth Debug - Token:', token ? 'exists' : 'missing');
                console.log('Auth Debug - User:', user ? JSON.parse(user) : 'missing');
                console.log('Auth Debug - Redux user:', authState.user);
                console.log('Auth Debug - isAuthenticated:', authState.isAuthenticated);
                alert('Check console for auth debug info');
              }}
              className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
            >
              🔐 Debug Auth
            </button>
            
            <button
              onClick={async () => {
                if (!user?.id) {
                  alert('No user ID found');
                  return;
                }
                try {
                  const response = await apiService.getUserFavorites(user.id);
                  console.log('Favorites response:', response);
                  if (response.success && response.data) {
                    const trials = response.data.trials?.length || 0;
                    const researchers = response.data.researchers?.length || 0;
                    const publications = response.data.publications?.length || 0;
                    alert(`Favorites: ${trials} trials, ${researchers} researchers, ${publications} publications. Check console for details.`);
                  } else {
                    alert('Failed to fetch favorites: ' + (response.message || 'Unknown error'));
                  }
                } catch (error) {
                  console.error('Favorites error:', error);
                  alert('Error fetching favorites: ' + error);
                }
              }}
              className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
            >
              ⭐ Check Favorites
            </button>
            
            <button
              onClick={() => {
                // Trigger a page refresh to reload all favorites state
                window.location.reload();
              }}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
            >
              🔄 Refresh Page
            </button>
            
            <button
              onClick={async () => {
                if (!user?.id) {
                  alert('No user ID found');
                  return;
                }
                try {
                  console.log('Testing favorites API...');
                  const response = await apiService.addFavoriteResearcher(user.id, 'test-researcher-id');
                  console.log('Add favorite response:', response);
                  if (response.success) {
                    alert('Successfully added to favorites');
                  } else {
                    alert('Failed to add (expected): ' + response.message);
                  }
                } catch (error) {
                  console.error('Caught error:', error);
                  alert('Caught error: ' + error);
                }
              }}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              🧪 Test Favorites API
            </button>
            
            <button
              onClick={() => {
                console.log('Dashboard Data:', dashboardData);
                console.log('Favorites Data:', dashboardData?.favorites);
                alert('Check console for dashboard data details');
              }}
              className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
            >
              🔍 Debug Dashboard
            </button>
            
            <button
              onClick={() => {
                // Show current favorites state from Redux
                const state = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.getState?.() || {};
                const favorites = state.favorites || {};
                console.log('Redux Favorites State:', favorites);
                alert(`Redux Favorites: ${favorites.favoriteTrials?.length || 0} trials, ${favorites.favoriteResearchers?.length || 0} researchers, ${favorites.favoritePublications?.length || 0} publications`);
              }}
              className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
            >
              🔄 Check Redux State
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div>
            <p className="text-xl text-slate-600">
              {isPatient 
                ? "Here's what's new in your healthcare journey" 
                : "Here's your research activity overview"
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPatient 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isPatient ? '🏥 Patient' : '🔬 Researcher'}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isPatient ? (
            <>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">12</p>
                    <p className="text-sm text-slate-600">Matching Trials</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">👨‍⚕️</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">8</p>
                    <p className="text-sm text-slate-600">Health Experts</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">25</p>
                    <p className="text-sm text-slate-600">New Publications</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {dashboardData?.favorites ? 
                        (dashboardData.favorites.favoriteTrials?.length || 0) + 
                        (dashboardData.favorites.favoriteResearchers?.length || 0) + 
                        (dashboardData.favorites.favoritePublications?.length || 0) 
                        : 0}
                    </p>
                    <p className="text-sm text-slate-600">Favorites</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">15</p>
                    <p className="text-sm text-slate-600">Collaborators</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🧪</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">3</p>
                    <p className="text-sm text-slate-600">Active Trials</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">7</p>
                    <p className="text-sm text-slate-600">Forum Replies</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">42</p>
                    <p className="text-sm text-slate-600">Publications</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {isPatient ? (
                  <>
                    <AnimatedCard
                      title="Find Clinical Trials"
                      description="Discover trials matching your condition and location"
                      icon="🔍"
                      gradient="from-green-500 to-emerald-600"
                      onClick={() => window.location.href = '/clinical-trials'}
                    />
                    <AnimatedCard
                      title="Connect with Experts"
                      description="Find and request meetings with health experts"
                      icon="👨‍⚕️"
                      gradient="from-blue-500 to-cyan-600"
                      onClick={() => window.location.href = '/experts'}
                    />
                    <AnimatedCard
                      title="Browse Publications"
                      description="Stay updated with latest research in your area"
                      icon="📚"
                      gradient="from-purple-500 to-pink-600"
                      onClick={() => window.location.href = '/publications'}
                    />
                    <AnimatedCard
                      title="Join Communities"
                      description="Connect with community and ask questions"
                      icon="💬"
                      gradient="from-orange-500 to-red-600"
                      onClick={() => window.location.href = '/community'}
                    />
                  </>
                ) : (
                  <>
                    <AnimatedCard
                      title="Add Clinical Trial"
                      description="Create and publish new clinical trials"
                      icon="�"
                      gradient="from-green-500 to-emerald-600"
                      onClick={() => window.location.href = '/clinical-trials/add'}
                    />
                    <AnimatedCard
                      title="Add Publication"
                      description="Share your research and publications"
                      icon="📚"
                      gradient="from-purple-500 to-indigo-600"
                      onClick={() => window.location.href = '/publications/add'}
                    />
                    <AnimatedCard
                      title="Create Community"
                      description="Start new discussions and communities"
                      icon="💬"
                      gradient="from-green-500 to-teal-600"
                      onClick={() => window.location.href = '/communities/create'}
                    />
                    <AnimatedCard
                      title="Meeting Requests"
                      description="Review and manage patient meeting requests"
                      icon="📅"
                      gradient="from-orange-500 to-red-600"
                      onClick={() => window.location.href = '/manage-meeting-requests'}
                    />
                  </>
                )}
              </div>
            </div>

            {/* My Favorites */}
            {dashboardData?.favorites && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">My Favorites</h2>
                  <Link 
                    to="/favorites" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  {dashboardData.favorites.favoriteTrials?.length > 0 || 
                   dashboardData.favorites.favoriteResearchers?.length > 0 || 
                   dashboardData.favorites.favoritePublications?.length > 0 ? (
                    <div className="space-y-4">
                      {/* Favorite Trials */}
                      {dashboardData.favorites.favoriteTrials?.slice(0, 2).map((fav: any) => (
                        <div key={fav.id} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🧪</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800">{fav.trial?.title || 'Clinical Trial'}</h3>
                            <p className="text-sm text-slate-600 mt-1">Phase {fav.trial?.phase || 'Unknown'}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              Added {new Date(fav.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Link 
                            to={`/clinical-trials/${fav.trial?.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View →
                          </Link>
                        </div>
                      ))}
                      
                      {/* Favorite Researchers */}
                      {dashboardData.favorites.favoriteResearchers?.slice(0, 2).map((fav: any) => (
                        <div key={fav.id} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">👨‍⚕️</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800">{fav.researcher?.user?.name || 'Health Expert'}</h3>
                            <p className="text-sm text-slate-600 mt-1">{fav.researcher?.user?.email}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              Added {new Date(fav.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Link 
                            to={`/experts/${fav.researcher?.userId}`}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View →
                          </Link>
                        </div>
                      ))}
                      
                      {/* Favorite Publications */}
                      {dashboardData.favorites.favoritePublications?.slice(0, 2).map((fav: any) => (
                        <div key={fav.id} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">📚</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800">{fav.publication?.title || 'Publication'}</h3>
                            <p className="text-sm text-slate-600 mt-1">{fav.publication?.journal}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              Added {new Date(fav.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Link 
                            to={`/publications/${fav.publication?.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View →
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">⭐</div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No Favorites Yet</h3>
                      <p className="text-slate-600 mb-4">Start exploring and save items you're interested in!</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Link
                          to="/clinical-trials"
                          className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Browse Trials
                        </Link>
                        <Link
                          to="/experts"
                          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Find Experts
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  {[
                    {
                      icon: isPatient ? "🔍" : "👥",
                      title: isPatient ? "New clinical trial match found" : "New collaboration request received",
                      time: "2 hours ago",
                      description: isPatient 
                        ? "A new brain cancer immunotherapy trial is now recruiting in your area"
                        : "Dr. Sarah Johnson wants to collaborate on your immunotherapy research"
                    },
                    {
                      icon: isPatient ? "📚" : "💬",
                      title: isPatient ? "New publication in your interest area" : "Patient question in Oncology forum",
                      time: "5 hours ago",
                      description: isPatient 
                        ? "Latest research on glioma treatment published in Nature Medicine"
                        : "Patient asking about side effects of CAR-T therapy"
                    },
                    {
                      icon: isPatient ? "👨‍⚕️" : "🧪",
                      title: isPatient ? "Expert available for consultation" : "Trial recruitment milestone reached",
                      time: "1 day ago",
                      description: isPatient 
                        ? "Dr. Michael Chen is now available for virtual consultations"
                        : "Your lung cancer trial has reached 50% recruitment target"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{activity.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Personalized Recommendations */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                {isPatient ? "Recommended for You" : "Suggested Connections"}
              </h2>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  {isPatient ? (
                    <>
                      <div className="border-l-4 border-green-400 pl-4">
                        <h3 className="font-semibold text-slate-800">Clinical Trial</h3>
                        <p className="text-sm text-slate-600">Brain Cancer Immunotherapy Phase II</p>
                        <Link to="/clinical-trials/1" className="text-xs text-green-600 hover:text-green-700">
                          Learn more →
                        </Link>
                      </div>
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h3 className="font-semibold text-slate-800">Expert</h3>
                        <p className="text-sm text-slate-600">Dr. Emily Rodriguez - Neuro-Oncologist</p>
                        <Link to="/experts/1" className="text-xs text-blue-600 hover:text-blue-700">
                          View profile →
                        </Link>
                      </div>
                      <div className="border-l-4 border-purple-400 pl-4">
                        <h3 className="font-semibold text-slate-800">Publication</h3>
                        <p className="text-sm text-slate-600">Latest advances in glioma treatment</p>
                        <Link to="/publications/1" className="text-xs text-purple-600 hover:text-purple-700">
                          Read paper →
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h3 className="font-semibold text-slate-800">Collaborator</h3>
                        <p className="text-sm text-slate-600">Dr. James Wilson - Immunology</p>
                        <Link to="/collaborators/1" className="text-xs text-blue-600 hover:text-blue-700">
                          Connect →
                        </Link>
                      </div>
                      <div className="border-l-4 border-green-400 pl-4">
                        <h3 className="font-semibold text-slate-800">Patient Interest</h3>
                        <p className="text-sm text-slate-600">5 patients interested in your CAR-T trial</p>
                        <Link to="/clinical-trials/manage" className="text-xs text-green-600 hover:text-green-700">
                          View details →
                        </Link>
                      </div>
                      <div className="border-l-4 border-purple-400 pl-4">
                        <h3 className="font-semibold text-slate-800">Forum Activity</h3>
                        <p className="text-sm text-slate-600">New questions in Oncology forum</p>
                        <Link to="/community/oncology" className="text-xs text-purple-600 hover:text-purple-700">
                          Respond →
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Links</h2>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-3">
                  <Link 
                    to="/favorites" 
                    className="flex items-center text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-3">⭐</span>
                    My Favorites
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-3">👤</span>
                    Edit Profile
                  </Link>
                  {isPatient ? (
                    <Link 
                      to="/meeting-requests" 
                      className="flex items-center text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      <span className="mr-3">📅</span>
                      Meeting Requests
                    </Link>
                  ) : (
                    <Link 
                      to="/manage-meeting-requests" 
                      className="flex items-center text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      <span className="mr-3">📅</span>
                      Manage Meetings
                    </Link>
                  )}
                  <Link 
                    to="/community" 
                    className="flex items-center text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-3">💬</span>
                    Community Forums
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;