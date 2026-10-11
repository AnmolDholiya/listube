import React from 'react';

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Fluid Aurora Gradient Blobs */}
      <div className="absolute top-0 left-0 right-0 h-[1000px] overflow-hidden">
        {/* Sky Blue Orb */}
        <div 
          className="absolute top-[10%] left-[25%] w-[480px] sm:w-[620px] h-[480px] sm:h-[620px] rounded-full animate-orb-1"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.16) 0%, rgba(96, 165, 250, 0.08) 50%, transparent 70%)',
            filter: 'blur(75px)',
          }}
        />

        {/* Soft Lavender Purple Orb */}
        <div 
          className="absolute top-[28%] right-[15%] w-[440px] sm:w-[580px] h-[440px] sm:h-[580px] rounded-full animate-orb-2"
          style={{
            background: 'radial-gradient(circle, rgba(196, 181, 253, 0.18) 0%, rgba(221, 214, 254, 0.09) 45%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Soft Indigo / Ice Accent Orb */}
        <div 
          className="absolute top-[5%] right-[35%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full animate-orb-3"
          style={{
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.14) 0%, rgba(167, 139, 250, 0.06) 50%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* 2. Delicate Geometric Dot Matrix */}
      <div 
        className="absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage: 'radial-gradient(rgba(17, 17, 17, 0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 3. Subtle Horizon Scanning Beam (Linear/Vercel Aesthetic) */}
      <div className="absolute left-0 right-0 top-0 h-[1px] overflow-hidden opacity-40">
        <div 
          className="w-full h-full animate-grid-beam"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.25) 30%, rgba(196, 181, 253, 0.35) 50%, rgba(59, 130, 246, 0.25) 70%, transparent 100%)',
            boxShadow: '0 0 16px rgba(96, 165, 250, 0.3)',
          }}
        />
      </div>

      {/* 4. Ambient Floating Micro-Glow Flecks */}
      <div className="absolute top-[22%] left-[18%] w-1.5 h-1.5 rounded-full bg-[#3B82F6]/30 animate-pulse" />
      <div className="absolute top-[40%] right-[22%] w-2 h-2 rounded-full bg-[#8B5CF6]/25 animate-pulse" style={{ animationDelay: '1.2s' }} />
      <div className="absolute top-[65%] left-[30%] w-1.5 h-1.5 rounded-full bg-[#60A5FA]/30 animate-pulse" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-[15%] right-[32%] w-1 h-1 rounded-full bg-[#A78BFA]/30 animate-pulse" style={{ animationDelay: '0.8s' }} />
    </div>
  );
};
