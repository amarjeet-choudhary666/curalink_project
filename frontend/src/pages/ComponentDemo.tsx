import React from 'react';
import AnimatedHero from '../components/AnimatedHero';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigate } from 'react-router-dom';

const ComponentDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <AnimatedHero
        title="Component"
        subtitle="Showcase"
        description="Experience our beautiful animated components in action"
        primaryAction={{
          text: "Get Started",
          onClick: () => navigate('/register')
        }}
        secondaryAction={{
          text: "Learn More",
          onClick: () => navigate('/about')
        }}
      />

      {/* Cards Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Animated Components
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard
              title="Research Collaboration"
              description="Connect with leading researchers and participate in groundbreaking studies"
              icon="🔬"
              gradient="from-blue-500 to-cyan-600"
              delay={0}
            />
            
            <AnimatedCard
              title="Patient Communities"
              description="Join supportive communities and share experiences with others"
              icon="👥"
              gradient="from-green-500 to-emerald-600"
              delay={200}
            />
            
            <AnimatedCard
              title="Clinical Trials"
              description="Discover and participate in clinical trials that match your profile"
              icon="🏥"
              gradient="from-purple-500 to-pink-600"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Loading Spinners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-slate-800">Loading States</h2>
          
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <LoadingSpinner size="sm" color="primary" />
              <p className="mt-2 text-sm text-slate-600">Small</p>
            </div>
            
            <div className="text-center">
              <LoadingSpinner size="md" color="primary" />
              <p className="mt-2 text-sm text-slate-600">Medium</p>
            </div>
            
            <div className="text-center">
              <LoadingSpinner size="lg" color="primary" />
              <p className="mt-2 text-sm text-slate-600">Large</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon="💬"
        onClick={() => alert('Chat opened!')}
        tooltip="Start a conversation"
        position="bottom-right"
        color="primary"
      />
    </div>
  );
};

export default ComponentDemo;