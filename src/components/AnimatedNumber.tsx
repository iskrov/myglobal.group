import React, { useEffect, useRef } from 'react';

type AnimatedNumberProps = {
  target: number;
  duration?: number;
  formatter?: (n: number) => string;
  style?: React.CSSProperties;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ target, duration = 1400, formatter, style }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = formatter ? formatter(value) : Math.round(value).toString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, formatter]);
  return <span ref={spanRef} style={style}>0</span>;
};

export default AnimatedNumber;


