import React, { useEffect, useState } from 'react';
import AnimatedHero from '../components/AnimatedHero';
import AnimatedCard from '../components/AnimatedCard';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      description: "Leading researcher in clinical trials with 15+ years of experience",
      avatar: "👩‍⚕️"
    },
    {
      name: "Michael Chen",
      role: "Head of Technology",
      description: "Expert in healthcare technology and patient data security",
      avatar: "👨‍💻"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Patient Advocacy Director",
      description: "Passionate about connecting patients with life-changing research",
      avatar: "👩‍🔬"
    }
  ];

  const values = [
    {
      title: "Patient-Centered",
      description: "Every decision we make puts patients and their needs first",
      icon: "❤️"
    },
    {
      title: "Scientific Excellence",
      description: "We maintain the highest standards in research and medical practice",
      icon: "🔬"
    },
    {
      title: "Transparency",
      description: "Open communication and clear information sharing at all times",
      icon: "🌟"
    },
    {
      title: "Innovation",
      description: "Constantly pushing boundaries to improve healthcare outcomes",
      icon: "🚀"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <AnimatedHero
        title="About"
        subtitle="Humanity Founder"
        description="We're on a mission to revolutionize healthcare through meaningful connections between patients, researchers, and medical professionals."
        backgroundGradient="from-blue-50 via-purple-50 to-pink-50"
      />

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-slate-800 mb-8">Our Mission</h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-12">
              We believe that breakthrough medical discoveries happen when patients, researchers, and healthcare 
              professionals work together. Our platform breaks down traditional barriers and creates meaningful 
              connections that accelerate research and improve patient outcomes.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Connect</h3>
                <p className="text-slate-600">Bringing together diverse perspectives and expertise</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Discover</h3>
                <p className="text-slate-600">Finding the right opportunities and collaborations</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Grow</h3>
                <p className="text-slate-600">Advancing medical knowledge and patient care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              These core principles guide everything we do and shape how we serve our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedCard
                key={index}
                title={value.title}
                description={value.description}
                icon={value.icon}
                delay={index * 200}
                gradient="from-blue-500 to-purple-600"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to transforming healthcare through innovation and collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 delay-${index * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-slate-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you're a patient seeking treatment options or a researcher looking to make an impact, 
              we'd love to have you as part of our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started Today
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;