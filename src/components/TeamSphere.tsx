import React from 'react';

type TeamSphereProps = {
  images?: string[];
  radius?: number;
  height?: number; // container height
};

// 3D rotating sphere of avatars/photos. Pure component; no global side effects.
const TeamSphere: React.FC<TeamSphereProps> = ({
  images,
  radius = 220,
  height = 500,
}) => {
  const memberImages = images && images.length > 0 ? images : [
    // Defaults (replace as needed)
    '/images/igor.jpg',
    '/images/alexey.jpg', '/images/sergii.jpg',
    'https://picsum.photos/seed/t1/80/80', 'https://picsum.photos/seed/t2/80/80',
    'https://picsum.photos/seed/t3/80/80', 'https://picsum.photos/seed/t4/80/80',
    'https://picsum.photos/seed/t5/80/80', 'https://picsum.photos/seed/t6/80/80',
    'https://picsum.photos/seed/t7/80/80', 'https://picsum.photos/seed/t8/80/80',
    'https://picsum.photos/seed/t9/80/80', 'https://picsum.photos/seed/t10/80/80',
    'https://picsum.photos/seed/t11/80/80', 'https://picsum.photos/seed/t12/80/80',
    'https://picsum.photos/seed/t13/80/80', 'https://picsum.photos/seed/t14/80/80',
    'https://picsum.photos/seed/t15/80/80', 'https://picsum.photos/seed/t16/80/80',
    'https://picsum.photos/seed/t17/80/80',
  ];

  return (
    <div className="scroll-animate" style={{ position: 'relative', width: '100%', height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotateY(0deg) rotateX(5deg); }
          to { transform: rotateY(360deg) rotateX(5deg); }
        }
        .sphere-container {
          transform-style: preserve-3d;
          animation: spin 30s linear infinite;
        }
        .sphere-item {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          box-shadow: 0 0 15px rgba(47, 107, 255, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.3);
          transition: transform 0.3s ease-out;
          object-fit: cover;
        }
      `}</style>
      <div className="sphere-container" style={{ width: '1px', height: '1px' }}>
        {memberImages.map((src, index) => {
          const angle = (index / (memberImages.length / 2)) * Math.PI;

          let size = 80;
          if (index === 0) size = 120; // CEO prominent
          if (index === 1 || index === 2) size = 100; // Partners

          let transformStyle;
          if (index === 0) {
            transformStyle = `translateZ(${radius + 40}px) scale(1.1)`;
          } else {
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            const y = index % 4 === 0 ? 90 : (index % 4 === 1 ? -90 : (index % 4 === 2 ? 45 : -45));
            transformStyle = `translateX(${x}px) translateY(${y + (Math.random() - 0.5) * 60}px) translateZ(${z}px) rotateY(${angle + Math.PI / 2}rad)`;
          }

          return (
            <img
              key={index}
              className="sphere-item"
              src={src}
              alt={index === 0 ? 'CEO' : index <= 2 ? 'Partner' : 'Team Member'}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                marginLeft: `-${size/2}px`,
                marginTop: `-${size/2}px`,
                transform: transformStyle,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TeamSphere;


