import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ChartBarIcon, ClockIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import { DocumentCheckIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid';

const HomePage: React.FC = () => {
  const keyFeatures = [
    {
      name: 'AI-Driven Occupation Classification',
      description:
        'Uses NLP and semantic search to match job descriptions with the most relevant NCO-2015 codes, even when wording differs.',
      icon: MagnifyingGlassIcon,
    },
    {
      name: 'Automated Data Validation',
      description:
        'Detects anomalies, inconsistencies, and misclassifications automatically before submission.',
      icon: DocumentCheckIcon,
    },
    {
      name: 'Real-Time Analytics Dashboard',
      description:
        'Live statistics on accuracy, speed, and data coverage for monitoring and improvements.',
      icon: ChartBarIcon,
    },
    {
      name: 'Rapid Processing Speed',
      description:
        'Reduces classification time from hours to seconds while maintaining high accuracy.',
      icon: ClockIcon,
    },
    {
      name: 'Role-Based Secure Access',
      description:
        'Separate permissions for enumerators, analysts, and administrators to ensure data security.',
      icon: UsersIcon,
    },
    {
      name: 'Government-Grade Security',
      description:
        'End-to-end encryption and secure cloud storage that complies with MoSPI standards.',
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white font-sans">
      {/* Government Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-2"></div>
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">Government of India</div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="text-sm">Ministry of Statistics and Programme Implementation</div>
          </div>
          <div className="text-sm font-medium">Digital India Initiative</div>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Official Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                <ShieldCheckIcon className="h-5 w-5 text-blue-700 mr-2" />
                <span className="text-sm font-semibold text-blue-800">Official Government Portal</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl font-bold text-blue-900 leading-tight">
                  <span className="block">DAsort</span>
                  <span className="text-4xl text-blue-700 font-medium">AI Classification Portal</span>
                </h1>
                <p className="text-xl text-slate-700 font-medium leading-relaxed">
                  Advanced AI-enabled Semantic Search for National Classification of Occupation (NCO-2015)
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-3">
                  Revolutionary NCO Classification System
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Official platform developed in collaboration with the Ministry of Statistics and Programme Implementation (MoSPI)
                  to automate and enhance the classification of occupations under the NCO-2015 framework.
                  Engineered to eliminate manual errors, maximize classification accuracy, and accelerate nationwide survey workflows.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex-1">
                  <Button className="w-full px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg">
                    🚀 Access Portal
                  </Button>
                </Link>
                <Link to="/about" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full px-8 py-4 border-2 border-blue-700 text-blue-700 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    📋 Learn More
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-white/60 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-900">3,600+</div>
                  <div className="text-sm text-slate-600">NCO Codes</div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-700">99%</div>
                  <div className="text-sm text-slate-600">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl border border-purple-100">
                  <div className="text-2xl font-bold text-purple-700">10x</div>
                  <div className="text-sm text-slate-600">Faster</div>
                </div>
              </div>
            </div>

            {/* Enhanced Hero Visualization */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-blue-200">
                {/* Dashboard Preview */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Classification Engine</h3>
                        <p className="text-blue-200 text-sm">Real-time semantic analysis</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Search Interface Mockup */}
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="h-2 bg-gray-200 rounded flex-1"></div>
                      <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>

                  {/* Results Preview */}
                  <div className="space-y-2">
                    {[
                      { confidence: "95%", code: "2512.01", color: "bg-green-400" },
                      { confidence: "87%", code: "2512.02", color: "bg-blue-400" },
                      { confidence: "75%", code: "2512.03", color: "bg-yellow-400" }
                    ].map((result, index) => (
                      <div key={index} className="bg-white/90 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${result.color} rounded-full`}></div>
                          <span className="text-sm font-medium text-gray-900">NCO {result.code}</span>
                        </div>
                        <span className="text-sm font-bold text-blue-700">{result.confidence}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute top-1/2 -right-4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-25"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE OVERVIEW */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-6">
              <span className="text-sm font-semibold tracking-widest uppercase text-red-800">
                Current Challenges
              </span>
            </div>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">
              Transforming Traditional Classification Methods
            </h3>
            <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
              The existing manual process relies on static keyword searches in NCO-2015 documents, 
              creating bottlenecks that hinder efficient data collection for critical government surveys 
              and policy decisions.
            </p>
          </div>

          {/* Challenge Cards with Professional Design */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Time-Intensive Process',
                description: 'Manual scanning of 3,600+ occupation codes requires specialized staff and consumes valuable hours per classification.',
                icon: '⏱️',
                impact: 'High',
              },
              {
                title: 'Classification Errors',
                description: 'Keyword dependency leads to misclassification and compromised data quality in national surveys.',
                icon: '⚠️',
                impact: 'Critical',
              },
              {
                title: 'Scalability Limitations',
                description: 'Manual workflows cannot efficiently handle nationwide enumeration projects and large datasets.',
                icon: '📊',
                impact: 'Medium',
              },
              {
                title: 'Training Requirements',
                description: 'Enumerators need extensive training in complex occupation taxonomies, delaying project deployment.',
                icon: '🎓',
                impact: 'High',
              },
            ].map((challenge, index) => (
              <div
                key={index}
                className="relative bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Impact Badge */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-gray-700 text-white text-xs font-medium rounded">
                  {challenge.impact}
                </div>
                
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-700 text-xl rounded-lg mb-4 hover:bg-gray-200 transition-colors duration-300">
                  {challenge.icon}
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {challenge.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {challenge.description}
                </p>
              </div>
            ))}
          </div>

          {/* Solution Preview */}
          <div className="mt-16 bg-blue-100 border border-blue-200 rounded-lg p-8 text-gray-900 shadow-lg">
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-4 text-blue-900">Our AI-Powered Solution</h4>
              <p className="text-lg text-blue-800 mb-8 max-w-3xl mx-auto">
                DAsort eliminates these challenges through intelligent automation, reducing classification time by 90% 
                while achieving 99%+ accuracy rates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">🚀</div>
                  <div className="text-xl font-semibold mb-2 text-gray-900">Instant Results</div>
                  <div className="text-gray-600 text-sm">Real-time semantic matching</div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">🎯</div>
                  <div className="text-xl font-semibold mb-2 text-gray-900">99% Accuracy</div>
                  <div className="text-gray-600 text-sm">AI-validated classifications</div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">🔐</div>
                  <div className="text-xl font-semibold mb-2 text-gray-900">Secure & Compliant</div>
                  <div className="text-gray-600 text-sm">Government-grade security</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANCED CAPABILITIES */}
      <section className="bg-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-6">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-800">
                Advanced Capabilities
              </span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Next-Generation Classification Technology
            </h2>
            <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
              Built with cutting-edge AI and machine learning technologies to deliver unprecedented accuracy 
              and efficiency in occupation classification for government applications.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {keyFeatures.map((feature) => (
              <div
                key={feature.name}
                className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Feature Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Feature Status */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      ✅ Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM DEMONSTRATION */}

    </div>
  );
};

export default HomePage;
