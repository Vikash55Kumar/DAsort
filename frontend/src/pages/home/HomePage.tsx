import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const features = [
    {
      name: 'Smart Search',
      description: 'AI-powered semantic search for accurate job classification',
      icon: MagnifyingGlassIcon,
    },
    {
      name: 'Data Analytics',
      description: 'Real-time insights and comprehensive reporting',
      icon: ChartBarIcon,
    },
    {
      name: 'Data Cleaning',
      description: 'Automated data validation and anomaly detection',
      icon: DocumentCheckIcon,
    },
    {
      name: 'Fast Processing',
      description: 'Quick results with high confidence scores',
      icon: ClockIcon,
    },
    {
      name: 'Multi-user Support',
      description: 'Role-based access for teams and organizations',
      icon: UsersIcon,
    },
    {
      name: 'Secure & Reliable',
      description: 'Government-grade security and data protection',
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">AI-Enabled</span>{' '}
                  <span className="block text-blue-600 xl:inline">NCO Classification</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Streamline National Classification of Occupation with intelligent semantic search. 
                  Reduce manual errors, increase accuracy, and accelerate data collection processes.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/register">
                      <Button size="lg" className="w-full px-8 py-3">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/about">
                      <Button variant="outline" size="lg" className="w-full px-8 py-3">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-blue-50 to-indigo-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-6xl text-blue-200">🔍</div>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">The Challenge</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Manual Job Classification Problems
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Current NCO-2015 classification relies on exact keyword matches in static documents, 
              leading to inefficiencies and errors in national surveys.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Time-Consuming Process',
                  description: 'Manual search through 3,600+ occupation codes across 52 sectors requires extensive training and expertise.',
                },
                {
                  name: 'Error-Prone Classification',
                  description: 'Exact keyword matching leads to misclassification and inconsistent data quality across regions.',
                },
                {
                  name: 'Limited Scalability',
                  description: 'Current system cannot handle large-scale surveys efficiently or adapt to new job descriptions.',
                },
                {
                  name: 'Training Overhead',
                  description: 'Enumerators need extensive familiarity with occupation taxonomy hierarchy and classification rules.',
                },
              ].map((item) => (
                <div key={item.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                      ⚠️
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{item.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Solution</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Intelligent AI-Powered Features
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Advanced semantic search and automation tools designed for government data collection efficiency.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to modernize</span>
            <span className="block">your data collection?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join the future of government statistics with AI-powered classification.
          </p>
          <Link to={"/register"}>
            <Button variant="secondary" size="lg" className="mt-8 bg-white text-blue-600 hover:bg-gray-50">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
