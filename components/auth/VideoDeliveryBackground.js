'use client';
import { useEffect, useRef } from 'react';
export default function VideoDeliveryBackground() {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
    }
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover motion-reduce:hidden sm:block hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          opacity: 0.18,
          filter: 'blur(2px) brightness(0.7) contrast(1.1)',
          mixBlendMode: 'normal',
          transform: 'scale(1.05)',
        }}
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-delivery-person-on-a-scooter-7297/1080p.mp4"
          type="video/mp4"
        />
        <source
          src="https://cdn.coverr.co/videos/coverr-delivery-person-on-a-scooter-7297/1080p.webm"
          type="video/webm"
        />
      </video>
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-950/40"
        style={{ zIndex: 2 }}
      />
    </div>
  );
}