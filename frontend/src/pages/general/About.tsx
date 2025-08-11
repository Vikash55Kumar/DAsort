import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">About the Project</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            AI-enabled Semantic Search for NCO
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Revolutionizing the National Classification of Occupation with advanced AI and semantic search capabilities.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-16">
            {/* Project Overview */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h3>
              <div className="prose prose-lg text-gray-500">
                <p>
                  The National Classification of Occupation (NCO) is a standardized system for classifying 
                  occupations in India, aligned with the International Standard Classification of Occupations (ISCO). 
                  The current version, NCO-2015, includes detailed descriptions of 3,600 civilian occupations 
                  across 52 sectors, structured through an 8-digit hierarchical code.
                </p>
                <p>
                  Our AI-powered solution transforms the traditional keyword-based search into an intelligent 
                  semantic search system that understands context, synonyms, and job relationships, making 
                  occupation classification faster, more accurate, and scalable.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h3>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'Semantic Search',
                    description: 'Natural language processing to understand job descriptions and find relevant NCO codes with confidence scores.',
                    icon: '🧠',
                  },
                  {
                    title: 'Data Processing',
                    description: 'Automated ingestion and indexing of NCO-2015 data with hierarchical structure preservation.',
                    icon: '⚙️',
                  },
                  {
                    title: 'Multi-language Support',
                    description: 'Support for Hindi and regional languages to enable nationwide accessibility.',
                    icon: '🌐',
                  },
                  {
                    title: 'Admin Dashboard',
                    description: 'Comprehensive management panel for data updates, user management, and system monitoring.',
                    icon: '📊',
                  },
                  {
                    title: 'API Integration',
                    description: 'RESTful APIs for seamless integration with existing MoSPI survey applications.',
                    icon: '🔗',
                  },
                  {
                    title: 'Audit Trail',
                    description: 'Complete logging of search history, manual overrides, and system usage for accountability.',
                    icon: '📋',
                  },
                ].map((feature) => (
                  <div key={feature.title} className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expected Impact</h3>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Improved Efficiency</h4>
                    <p className="text-blue-700">
                      Reduce manual effort for enumerators and significantly increase classification accuracy 
                      across all government surveys.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Enhanced Data Quality</h4>
                    <p className="text-blue-700">
                      Consistent classification standards across regions leading to better policy planning 
                      and evidence-based governance.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Cost Reduction</h4>
                    <p className="text-blue-700">
                      Minimize training time and resources while accelerating survey preparation and 
                      data collection processes.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Scalable Solution</h4>
                    <p className="text-blue-700">
                      Enable intelligent, automated systems for national classification tasks that can 
                      adapt to changing job markets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Technology Stack</h3>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[
                  { name: 'React', description: 'Frontend Framework' },
                  { name: 'TypeScript', description: 'Type Safety' },
                  { name: 'Tailwind CSS', description: 'Styling' },
                  { name: 'Node.js', description: 'Backend Runtime' },
                  { name: 'Python', description: 'AI/ML Processing' },
                  { name: 'BERT/Transformers', description: 'NLP Models' },
                  { name: 'FAISS', description: 'Vector Search' },
                  { name: 'PostgreSQL', description: 'Database' },
                ].map((tech) => (
                  <div key={tech.name} className="text-center">
                    <div className="bg-gray-100 rounded-lg p-4 mb-2">
                      <h4 className="font-medium text-gray-900">{tech.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
