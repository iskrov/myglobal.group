import React, { useEffect } from 'react';

export const useScrollReveal = (options?: IntersectionObserverInit) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px', ...(options || {}) }
    );

    const isInViewport = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 0) && r.bottom > 0 && r.left < (window.innerWidth || 0) && r.right > 0;
    };

    const observeAll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((el) => {
        if ((el as HTMLElement).classList.contains('is-visible')) return;
        if (isInViewport(el)) {
          (el as HTMLElement).classList.add('is-visible');
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial pass
    observeAll();

    // Watch for new nodes being added (e.g., route switches)
    const domObserver = new MutationObserver(() => {
      observeAll();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      domObserver.disconnect();
    };
  }, [options]);
};

type RevealProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

// Generic wrapper that applies the scroll-animate class and activates the observer
export const Reveal: React.FC<RevealProps> = ({ as = 'div', className, style, children }) => {
  useScrollReveal();
  const Comp: any = as;
  const cls = className ? `${className} scroll-animate` : 'scroll-animate';
  return <Comp className={cls} style={style}>{children}</Comp>;
};

// HOC helper to decorate any component with the scroll reveal behavior
export function withReveal<P extends { className?: string }>(Wrapped: React.ComponentType<P>) {
  return function WithRevealComponent(props: P) {
    useScrollReveal();
    const className = props.className ? `${props.className} scroll-animate` : 'scroll-animate';
    return <Wrapped {...props} className={className} />;
  };
}

export default Reveal;


