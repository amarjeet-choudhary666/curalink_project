import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">CL</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                CuraLink
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 mb-4 font-medium">
              AI-Powered Healthcare Connections
            </p>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connecting patients and researchers to discover relevant clinical trials, 
              medical publications, and health experts through intelligent matching.
            </p>

            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                to="/register?role=patient" 
                className="group relative px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-3 text-2xl">🏥</span>
                  I am a Patient or Caregiver
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/register?role=researcher" 
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-3 text-2xl">🔬</span>
                  I am a Researcher
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">How CuraLink Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, intelligent, and designed for meaningful healthcare connections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Matching",
                description: "Our intelligent system analyzes your profile and matches you with relevant opportunities, experts, and research."
              },
              {
                icon: "🔍",
                title: "Discover & Connect",
                description: "Find clinical trials, research publications, and health experts tailored to your specific conditions and interests."
              },
              {
                icon: "💬",
                title: "Collaborate & Learn",
                description: "Join communities, request meetings with experts, and participate in meaningful healthcare discussions."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 delay-${400 + index * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-center p-8 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300 hover:shadow-lg">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className={`text-center mb-12 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Healthcare Community</h2>
            <p className="text-xl text-blue-100">Making meaningful connections every day</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "500+", label: "Clinical Trials" },
              { number: "50+", label: "Medical Centers" },
              { number: "95%", label: "Match Success Rate" }
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 delay-${700 + index * 100} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600">Real impact from our community</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "CuraLink connected me with a clinical trial for my brain cancer. The AI matching was incredibly accurate.",
                author: "Sarah M.",
                role: "Patient",
                condition: "Brain Cancer"
              },
              {
                quote: "As an oncology researcher, I've found amazing collaborators and patients through this platform.",
                author: "Dr. James L.",
                role: "Researcher",
                specialty: "Oncology"
              },
              {
                quote: "The community forums have been invaluable for connecting with other patients and getting expert advice.",
                author: "Maria R.",
                role: "Caregiver",
                condition: "Lung Cancer"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 delay-${900 + index * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="text-slate-600 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{testimonial.author}</div>
                      <div className="text-slate-500 text-sm">{testimonial.role}</div>
                      <div className="text-blue-600 text-xs font-medium">
                        {testimonial.condition || testimonial.specialty}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands who are already making meaningful connections in healthcare research.
            </p>
            
            <Link 
              to="/register" 
              className="inline-block px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;