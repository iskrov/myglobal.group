import { Check } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

export function ValueProposition() {
  const { config, loading, error } = useSiteConfig();

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-12 mx-auto max-w-lg"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !config) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Unable to load value proposition configuration.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { valueProposition, branding } = config;

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {valueProposition.headline}
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {valueProposition.description}
            </p>
            
            <div className="space-y-4">
              {valueProposition.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: branding.colors.primary }}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br opacity-20 absolute inset-0"
                 style={{ 
                   background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` 
                 }}>
            </div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: branding.colors.primary }}>
                  99.9%
                </div>
                <div className="text-gray-600 dark:text-gray-300 mb-6">
                  Customer Satisfaction
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 