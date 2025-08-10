import { useSiteConfig } from '../hooks/useSiteConfig';

export function UseCases() {
  const { config, loading, error } = useSiteConfig();

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-16 mx-auto max-w-lg"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !config) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Use Cases
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Unable to load use cases configuration.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { useCases, branding } = config;

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Perfect for Every Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Whether you're a startup or enterprise, we have the right solution for your needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index} 
              className="group border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-opacity-0"
              style={{
                '--hover-border-color': branding.colors.primary
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = branding.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
              }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {useCase.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {useCase.description}
              </p>
              
              <ul className="space-y-3">
                {useCase.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <div 
                      className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: branding.colors.primary }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  className="w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: `${branding.colors.primary}10`,
                    color: branding.colors.primary,
                    border: `1px solid ${branding.colors.primary}20`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = branding.colors.primary;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${branding.colors.primary}10`;
                    e.currentTarget.style.color = branding.colors.primary;
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 