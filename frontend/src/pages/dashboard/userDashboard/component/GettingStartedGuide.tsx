import React from 'react';
import { 
  PlayIcon, 
  DocumentTextIcon, 
  AcademicCapIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const GettingStartedGuide: React.FC = () => {
  // Mock data - In real app, this would track user progress
  const guideSteps: GuideStep[] = [
    {
      id: '1',
      title: 'Complete Your Profile',
      description: 'Add your department and regional information for better classification results',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      completed: true,
      action: {
        label: 'View Profile',
        href: '/profile'
      }
    },
    {
      id: '2',
      title: 'Try Your First Search',
      description: 'Search for a job classification to see how the system works',
      icon: <PlayIcon className="h-5 w-5" />,
      completed: true,
      action: {
        label: 'Start Searching',
        href: '/job-search'
      }
    },
    {
      id: '3',
      title: 'Learn NCO Classification',
      description: 'Understand the National Classification of Occupations structure and hierarchy',
      icon: <AcademicCapIcon className="h-5 w-5" />,
      completed: false,
      action: {
        label: 'Read Guide',
        href: '/help'
      }
    },
    {
      id: '4',
      title: 'Upload Your First Dataset',
      description: 'Upload a CSV or Excel file to classify multiple job roles at once',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      completed: false,
      action: {
        label: 'Upload Dataset',
        href: '/my-datasets'
      }
    },
    {
      id: '5',
      title: 'Contact Support',
      description: 'Get help from our support team if you need assistance',
      icon: <PhoneIcon className="h-5 w-5" />,
      completed: false,
      action: {
        label: 'Contact Us',
        href: '/contact'
      }
    }
  ];

  const completedSteps = guideSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / guideSteps.length) * 100;

  return (
    <div className="space-y-4">
      
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-[#00295d] to-[#01408f] rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Getting Started Progress</h3>
          <span className="text-sm font-medium">{completedSteps}/{guideSteps.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs mt-2 opacity-90">
          {progressPercentage === 100 
            ? "Congratulations! You've completed all setup steps."
            : `${Math.round(progressPercentage)}% complete - Keep going!`
          }
        </p>
      </div>

      {/* Guide Steps */}
      <div className="space-y-3">
        {guideSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`border rounded-lg p-4 transition-colors ${
              step.completed 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                step.completed 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {step.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">
                    Step {index + 1}
                  </span>
                  {step.completed && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Completed
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  {step.description}
                </p>
                
                {step.action && !step.completed && (
                  <button 
                    className="inline-flex items-center text-xs font-medium text-[#00295d] hover:text-[#01408f] transition-colors"
                    onClick={() => {
                      if (step.action?.href) {
                        window.location.href = step.action.href;
                      } else if (step.action?.onClick) {
                        step.action.onClick();
                      }
                    }}
                  >
                    {step.action.label}
                    <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Resources */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Need Help?</h4>
        <div className="space-y-2">
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">User Manual</p>
                <p className="text-xs text-gray-600">Complete guide to using the NCO portal</p>
              </div>
            </div>
          </button>
          
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Live Chat Support</p>
                <p className="text-xs text-gray-600">Chat with our support team (9 AM - 6 PM)</p>
              </div>
            </div>
          </button>
          
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone Support</p>
                <p className="text-xs text-gray-600">1800-XXX-XXXX (Toll-free)</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedGuide;
