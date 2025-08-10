import { Mail, Phone, Twitter, Linkedin, Github } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

export function Footer() {
  const { config, loading, error } = useSiteConfig();

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-6 bg-gray-700 rounded mb-4 w-24"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-gray-700 rounded w-20"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (error || !config) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-400">
              Unable to load footer configuration.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  const { footer, branding, site } = config;

  const socialIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github,
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              {branding.logo.hasIcon && branding.logo.iconUrl ? (
                <img src={branding.logo.iconUrl} alt={branding.logo.text} className="h-8 w-8 mr-2" />
              ) : (
                <div 
                  className="w-8 h-8 rounded-lg mr-2 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: branding.colors.primary }}
                >
                  {branding.logo.text.charAt(0)}
                </div>
              )}
              <span className="text-xl font-bold">{branding.logo.text}</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {footer.company.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {footer.contact.email && (
                <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 mr-3" />
                  <a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a>
                </div>
              )}
              {footer.contact.phone && (
                <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 mr-3" />
                  <a href={`tel:${footer.contact.phone}`}>{footer.contact.phone}</a>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footer.links.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={`#${link.toLowerCase()}`} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footer.links.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={`#${link.toLowerCase()}`} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 mb-6">
              {footer.links.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={`#${link.toLowerCase()}`} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {Object.entries(footer.social).map(([platform, url]) => {
                if (!url) return null;
                const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                if (!IconComponent) return null;
                
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {footer.company.name}. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Built with ❤️ using Web Hull Template
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 