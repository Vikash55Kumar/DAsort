import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-[#f4f6f9] py-16 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-[#00295d]">
            About the Project
          </h2>
          <p className="mt-2 text-4xl font-bold text-gray-900">
            AI-enabled Semantic Search for NCO
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Revolutionizing the National Classification of Occupation with advanced AI and semantic search capabilities.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Project Overview */}
        <section>
          <h3 className="text-2xl font-bold text-[#00295d] mb-4">Project Overview</h3>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              The National Classification of Occupation (NCO) is a standardized system for classifying occupations in India,
              aligned with the International Standard Classification of Occupations (ISCO). The current version, NCO-2015,
              includes detailed descriptions of 3,600 civilian occupations across 52 sectors, structured through an
              8-digit hierarchical code.
            </p>
            <p>
              Our AI-powered solution transforms the traditional keyword-based search into an intelligent semantic search
              system that understands context, synonyms, and job relationships, making occupation classification faster,
              more accurate, and scalable.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h3 className="text-2xl font-bold text-[#00295d] mb-8">Key Features</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Semantic Search', description: 'Natural language processing to understand job descriptions and find relevant NCO codes with confidence scores.', icon: '🧠' },
              { title: 'Data Processing', description: 'Automated ingestion and indexing of NCO-2015 data with hierarchical structure preservation.', icon: '⚙️' },
              { title: 'Multi-language Support', description: 'Support for Hindi and regional languages to enable nationwide accessibility.', icon: '🌐' },
              { title: 'Admin Dashboard', description: 'Comprehensive management panel for data updates, user management, and system monitoring.', icon: '📊' },
              { title: 'API Integration', description: 'RESTful APIs for seamless integration with existing MoSPI survey applications.', icon: '🔗' },
              { title: 'Audit Trail', description: 'Complete logging of search history, manual overrides, and system usage for accountability.', icon: '📋' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expected Impact */}
        <section>
          <h3 className="text-2xl font-bold text-[#00295d] mb-4">Expected Impact</h3>
          <div className="grid gap-6 sm:grid-cols-2 bg-[#f4f6f9] p-8 rounded-lg">
            {[
              { title: 'Improved Efficiency', desc: 'Reduce manual effort for enumerators and significantly increase classification accuracy across all government surveys.' },
              { title: 'Enhanced Data Quality', desc: 'Consistent classification standards across regions leading to better policy planning and evidence-based governance.' },
              { title: 'Cost Reduction', desc: 'Minimize training time and resources while accelerating survey preparation and data collection processes.' },
              { title: 'Scalable Solution', desc: 'Enable intelligent, automated systems for national classification tasks that can adapt to changing job markets.' },
            ].map((impact) => (
              <div key={impact.title}>
                <h4 className="text-lg font-semibold text-[#00295d]">{impact.title}</h4>
                <p className="text-gray-700 text-sm mt-2">{impact.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h3 className="text-2xl font-bold text-[#00295d] mb-8">Technology Stack</h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
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
              <div
                key={tech.name}
                className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 bg-white"
              >
                <h4 className="font-medium text-gray-900">{tech.name}</h4>
                <p className="text-sm text-gray-500">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
