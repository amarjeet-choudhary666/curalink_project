import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/AnimatedCard';

const Contact: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help with your account or technical issues",
      icon: "📧",
      contact: "support@humanityfounder.com",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Research Inquiries",
      description: "Questions about clinical trials and research opportunities",
      icon: "🔬",
      contact: "research@humanityfounder.com",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Partnership",
      description: "Interested in partnering with us?",
      icon: "🤝",
      contact: "partnerships@humanityfounder.com",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const officeLocations = [
    {
      city: "San Francisco",
      address: "123 Innovation Drive, Suite 400",
      phone: "+1 (555) 123-4567",
      flag: "🇺🇸"
    },
    {
      city: "London",
      address: "45 Medical Research Blvd",
      phone: "+44 20 1234 5678",
      flag: "🇬🇧"
    },
    {
      city: "Toronto",
      address: "789 Healthcare Avenue",
      phone: "+1 (416) 123-4567",
      flag: "🇨🇦"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're here to help you navigate your healthcare journey. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <AnimatedCard
                key={index}
                title={method.title}
                description={method.description}
                icon={method.icon}
                gradient={method.gradient}
                delay={index * 200}
              >
                <a 
                  href={`mailto:${method.contact}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  {method.contact}
                </a>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Locations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="research">Research Collaboration</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Office Locations */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Our Offices</h2>
              
              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <div
                    key={index}
                    className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{office.flag}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">{office.city}</h3>
                        <p className="text-slate-600 mb-2">{office.address}</p>
                        <p className="text-blue-600 font-semibold">{office.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Response Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">General Inquiries</span>
                    <span className="font-semibold text-blue-600">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Technical Support</span>
                    <span className="font-semibold text-green-600">4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Research Inquiries</span>
                    <span className="font-semibold text-purple-600">48 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How do I get started as a patient?",
                answer: "Simply create an account, complete your profile, and start exploring research opportunities that match your condition and interests."
              },
              {
                question: "Is my personal health information secure?",
                answer: "Absolutely. We use industry-leading encryption and comply with all HIPAA regulations to protect your sensitive health data."
              },
              {
                question: "How are researchers vetted on the platform?",
                answer: "All researchers undergo a thorough verification process including credential checks and institutional affiliations before joining our platform."
              },
              {
                question: "Can I participate in multiple studies?",
                answer: "Yes, you can participate in multiple studies as long as they don't conflict with each other. Our system will help identify any potential conflicts."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;