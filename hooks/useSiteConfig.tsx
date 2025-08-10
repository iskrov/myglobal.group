import { useState, useEffect } from 'react';

interface SiteConfig {
  site: {
    title: string;
    description: string;
    tagline: string;
    domain: string;
  };
  branding: {
    logo: {
      text: string;
      hasIcon: boolean;
      iconUrl: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      textLight: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  hero: {
    headline: string;
    subheadline: string;
    cta: {
      primary: string;
      secondary: string;
    };
    image: {
      url: string;
      alt: string;
    };
    backgroundStyle: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  valueProposition: {
    headline: string;
    description: string;
    benefits: string[];
  };
  useCases: Array<{
    title: string;
    description: string;
    features: string[];
  }>;
  callToAction: {
    headline: string;
    description: string;
    cta: {
      primary: string;
      secondary: string;
    };
    urgency: string;
    trustSignals: string[];
  };
  footer: {
    company: {
      name: string;
      description: string;
    };
    links: {
      product: string[];
      company: string[];
      legal: string[];
    };
    social: {
      twitter: string;
      linkedin: string;
      github: string;
    };
    contact: {
      email: string;
      phone: string;
    };
  };
  seo: {
    keywords: string[];
    ogImage: string;
    twitterCard: string;
  };
}

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/site-config.json');
        if (!response.ok) {
          throw new Error(`Failed to load site configuration: ${response.statusText}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load site configuration');
        console.error('Error loading site config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
};

export type { SiteConfig }; 