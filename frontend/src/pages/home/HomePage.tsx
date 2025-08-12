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
    <div className="bg-white font-sans">
      {/* HERO */}
      <section className="bg-[#ecf0f3] border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <h1 className="text-5xl font-bold text-[#00295d] mb-2">This is DAsort</h1>
                <p className="text-xl text-gray-600 font-medium">
                  AI-enabled Semantic Search for National Classification of Occupation (NCO)
                </p>
              </div>
              <h2 className="text-3xl font-bold text-[#00295d] mb-4">
                AI-Enabled NCO Classification Portal
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl">
                Official platform developed to assist the Ministry of Statistics and Programme Implementation (MoSPI)
                in automating the classification of occupations under the NCO-2015 framework.
                Designed to minimize manual errors, improve classification accuracy, and accelerate survey workflows.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/register">
                  <Button className="px-8 py-3 bg-[#00295d] text-white hover:bg-blue-900">
                    Access Portal
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="outline"
                    className="px-8 py-3 border-[#00295d] text-[#00295d] hover:bg-gray-100"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-center h-64 bg-gradient-to-r from-[#00295d] to-blue-600 rounded-lg">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
                      <p className="text-blue-100">Semantic occupation classification</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-500 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THE PROBLEM */}
      <section className="bg-[#f9fafb] border-y border-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-[#00295d]">
              Problem Overview
            </h2>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              Challenges in Current Occupation Classification
            </h3>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
              The existing process relies heavily on manual keyword searches in static NCO-2015 documents.
              This approach is slow, inconsistent, and struggles to handle the vast datasets required
              for large-scale government surveys.
            </p>
          </div>

          {/* Problem Cards */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Time-Intensive',
                description:
                  'Manually scanning 3,600+ occupation codes consumes hours and demands specialized staff.',
                color: 'bg-red-600',
                icon: '⏱',
              },
              {
                title: 'High Error Rate',
                description:
                  'Exact keyword dependency often leads to misclassification and unreliable survey outcomes.',
                color: 'bg-yellow-500',
                icon: '⚠️',
              },
              {
                title: 'Limited Scalability',
                description:
                  'Manual workflows cannot meet the demands of nationwide enumeration projects efficiently.',
                color: 'bg-blue-600',
                icon: '📊',
              },
              {
                title: 'Training Overhead',
                description:
                  'Enumerators must learn complex occupation taxonomies, slowing down deployment.',
                color: 'bg-gray-700',
                icon: '🎓',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col border border-gray-300 p-6 bg-white hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className={`h-12 w-12 flex items-center justify-center text-white text-xl ${item.color}`}
                >
                  {item.icon}
                </div>
                <h4 className="mt-4 font-semibold text-gray-900">{item.title}</h4>
                <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="bg-white py-14 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm text-[#00295d] font-semibold tracking-wide uppercase text-center">
            Key Features
          </h2>
          <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl text-center">
            Why This Platform Stands Out
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {keyFeatures.map((feature) => (
              <div
                key={feature.name}
                className="flex items-start p-5 rounded-lg border border-gray-200 bg-white 
                          hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
              >
                <div className="flex-shrink-0 h-12 w-12 bg-[#00295d] text-white flex items-center justify-center rounded-md">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-1 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="bg-[#f9fafb] py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-[#00295d]">
            Watch the Demo
          </h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            See DAsort in Action
          </h3>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            A quick walkthrough of how our AI-enabled NCO classification portal works.
          </p>

          {/* Video Container */}
          <div className="mt-8 aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden shadow-md">
            {/* Replace the div below with an <iframe> or <video> tag when ready */}
            <div className="flex items-center justify-center h-full text-gray-500">
              Video Placeholder
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
