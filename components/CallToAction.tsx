import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

export function CallToAction() {
  const { config, loading, error } = useSiteConfig();

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6 mx-auto max-w-lg"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 mx-auto max-w-md"></div>
            <div className="flex justify-center gap-4 mb-8">
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !config) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to load call-to-action configuration.
          </p>
        </div>
      </section>
    );
  }

  const { callToAction, branding } = config;

  const trustIcons = {
    'No credit card required': CheckCircle,
    '30-day money-back guarantee': Shield,
    'Cancel anytime': Clock,
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {callToAction.headline}
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {callToAction.description}
        </p>
        
        {callToAction.urgency && (
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-8"
            style={{ 
              backgroundColor: `${branding.colors.accent}20`,
              color: branding.colors.accent 
            }}
          >
            {callToAction.urgency}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            className="group px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ backgroundColor: branding.colors.primary }}
          >
            {callToAction.cta.primary}
            <ArrowRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            className="px-8 py-4 font-semibold rounded-xl transition-all duration-200 border-2"
            style={{ 
              borderColor: branding.colors.primary,
              color: branding.colors.primary 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = branding.colors.primary;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = branding.colors.primary;
            }}
          >
            {callToAction.cta.secondary}
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
          {callToAction.trustSignals.map((signal, index) => {
            const IconComponent = trustIcons[signal as keyof typeof trustIcons] || CheckCircle;
            return (
              <div key={index} className="flex items-center">
                <IconComponent className="h-4 w-4 mr-2" style={{ color: branding.colors.primary }} />
                {signal}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 