import { ChevronRight, Play } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

export function Hero() {
  const { config, loading, error } = useSiteConfig();

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-8 mx-auto max-w-4xl"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-12 mx-auto max-w-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Welcome to Your Website
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Configuration loading failed. Please check your site-config.json file.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { hero, branding } = config;
  
  // Create CSS custom properties for colors
  const colorStyles = {
    '--color-primary': branding.colors.primary,
    '--color-secondary': branding.colors.secondary,
    '--color-accent': branding.colors.accent,
  } as React.CSSProperties;

  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900"
      style={colorStyles}
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            {hero.headline}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {hero.subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              className="group px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              style={{ backgroundColor: branding.colors.primary }}
            >
              {hero.cta.primary}
              <ChevronRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="group flex items-center px-8 py-4 text-gray-700 dark:text-gray-300 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors">
              <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              {hero.cta.secondary}
            </button>
          </div>
          
          {hero.image.url && (
            <div className="relative max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={hero.image.url} 
                  alt={hero.image.alt}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 