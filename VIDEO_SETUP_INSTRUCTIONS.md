# Video Delivery Background - Setup Instructions

## Current Implementation

The authentication page now uses a **REAL VIDEO** of a delivery rider instead of SVG/Lottie animations.

---

## Default Video Source

**Current CDN**: Coverr.co (free stock videos)
**Video**: Delivery person on scooter (urban setting)
**Format**: MP4 (1080p) + WebM fallback

**CDN URL**:
```
https://cdn.coverr.co/videos/coverr-delivery-person-on-a-scooter-7297/1080p.mp4
```

---

## Replace with Your Own Video

### Step 1: Prepare Your Video

**Requirements**:
- Real delivery rider on scooter/bike
- Duration: 5-8 seconds
- Natural horizontal/diagonal motion
- Night or urban setting preferred
- Seamless loop (start/end frames match)

**Video Specs**:
- Format: MP4 (H.264) + WebM (VP9) for best compatibility
- Resolution: 1080p or 720p
- File size: < 3MB (optimize for web)
- Frame rate: 24-30fps
- Bitrate: Compressed for streaming

### Step 2: Add Video to Project

**Option A: Local File**
```
1. Add video to: /public/videos/delivery-rider.mp4
2. Update component path:
   src="/videos/delivery-rider.mp4"
```

**Option B: CDN/Cloud Storage**
```
1. Upload to: Cloudinary, AWS S3, Vercel Blob, etc.
2. Get public URL
3. Update component:
   src="https://your-cdn.com/delivery-rider.mp4"
```

### Step 3: Update Component

**File**: `components/auth/VideoDeliveryBackground.js`

```jsx
<source
  src="/videos/delivery-rider.mp4"  // Your video path
  type="video/mp4"
/>
<source
  src="/videos/delivery-rider.webm"  // WebM fallback
  type="video/webm"
/>
```

---

## Video Optimization

### Compress Video
```bash
# Using FFmpeg (recommended)
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -vf scale=1280:720 \
  -c:a aac \
  -b:a 128k \
  output.mp4

# WebM version
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -vf scale=1280:720 \
  output.webm
```

### Online Tools
- CloudConvert.com
- HandBrake (free software)
- Online-convert.com

---

## Free Stock Video Sources

### Recommended Sources
1. **Pexels Videos**: pexels.com/videos
   - Search: "delivery scooter rider"
   - Free commercial use
   - No attribution required

2. **Coverr**: coverr.co
   - Currently used
   - Urban/lifestyle videos
   - Free for commercial use

3. **Pixabay Videos**: pixabay.com/videos
   - Search: "courier delivery bike"
   - Free license

4. **Videvo**: videvo.net
   - Some free, some premium
   - Check license

### Search Keywords
```
"delivery rider scooter night"
"courier bike urban"
"food delivery scooter city"
"amazon prime delivery motion"
"scooter delivery side view"
```

---

## Component Features

### Video Properties
```jsx
autoPlay    // Starts automatically
muted       // No sound
loop        // Infinite repeat
playsInline // Mobile compatibility
preload="auto" // Load immediately
```

### Styling
```css
opacity: 0.18           // Subtle presence
filter: blur(2px)       // Atmospheric depth
        brightness(0.7) // Darker for background
        contrast(1.1)   // Slightly enhanced
mixBlendMode: normal    // Standard blending
transform: scale(1.05)  // Slight zoom (no crop)
```

### Responsive Behavior
```
Desktop (≥640px):  Video visible
Mobile (<640px):   Video hidden
Reduced motion:    Video paused/hidden
```

### Z-Index Layers
```
Background gradient: z-0
Video layer:        z-1
Video overlay:      z-2
Login card:         z-20
```

---

## Performance Optimization

### Best Practices
1. **Compress video** < 3MB
2. **Use CDN** for faster loading
3. **Lazy load** if needed
4. **Preload** attribute for immediate play
5. **Multiple formats** (MP4 + WebM)

### Loading States
```jsx
// Optional: Add loading fallback
{!videoLoaded && <StaticBackground />}
```

### Bandwidth Considerations
- Video loads after page shell
- Uses streaming (not full download)
- Can be disabled on slow connections

---

## Customization Options

### Adjust Opacity
```jsx
style={{ opacity: 0.18 }}  // Current
// Try: 0.15 (more subtle) or 0.25 (more visible)
```

### Adjust Speed
```jsx
useEffect(() => {
  videoRef.current.playbackRate = 0.85;  // 85% speed
  // Try: 0.7 (slower) or 1.0 (normal)
}, []);
```

### Adjust Blur
```jsx
filter: 'blur(2px)'  // Current
// Try: blur(1px) (sharper) or blur(3px) (softer)
```

### Position Video
```jsx
// Current: Full cover
object-fit: cover

// Alternatives:
object-fit: contain  // Show full video
object-position: center  // Or: top, bottom, left, right
```

---

## Troubleshooting

### Video Not Playing
**Check**:
1. File path is correct
2. Video format supported (MP4 H.264)
3. CORS headers if CDN
4. Autoplay policies (muted required)

### Video Too Large
**Solutions**:
1. Compress with FFmpeg (see above)
2. Reduce resolution to 720p
3. Lower bitrate (CRF 28-30)
4. Trim duration to 5-6 seconds

### Choppy Playback
**Fixes**:
1. Reduce file size
2. Use H.264 (better hardware support)
3. Set lower playback rate
4. Add loading state

### Mobile Issues
**Checks**:
1. `playsInline` attribute present
2. Video hidden on small screens (CSS)
3. File size optimized for mobile

---

## Testing Checklist

**Visual**:
- [ ] Video loads and plays automatically
- [ ] Opacity correct (0.18, not too visible)
- [ ] Blur applied (2px atmospheric)
- [ ] Behind login card (z-index correct)
- [ ] No text overlap or distraction

**Performance**:
- [ ] Page loads quickly
- [ ] Video streams smoothly
- [ ] 60fps maintained on dashboard
- [ ] No jank or stutter

**Responsive**:
- [ ] Hidden on mobile (<640px)
- [ ] Visible on tablet/desktop
- [ ] Scales properly

**Accessibility**:
- [ ] Respects prefers-reduced-motion
- [ ] Muted (no audio surprise)
- [ ] Doesn't block interactions

**Compatibility**:
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## Example Video Sources (Direct CDN Links)

### Coverr.co (Current)
```
https://cdn.coverr.co/videos/coverr-delivery-person-on-a-scooter-7297/1080p.mp4
```

### Alternative Videos
**Urban courier**:
```
https://cdn.coverr.co/videos/coverr-courier-delivery-bike-8932/1080p.mp4
```

**Night delivery**:
```
https://cdn.coverr.co/videos/coverr-night-delivery-scooter-9421/1080p.mp4
```

*(Note: Verify these URLs are active and match your needs)*

---

## Advanced: Multiple Video Variants

**Option**: Show different videos based on time/theme

```jsx
const videoUrl = theme === 'night' 
  ? '/videos/delivery-night.mp4'
  : '/videos/delivery-day.mp4';

<source src={videoUrl} type="video/mp4" />
```

---

## Legal & Licensing

### Free Use Requirements
- Most stock videos: Free for commercial use
- No attribution required (usually)
- Read specific license terms

### Custom Video
- Own footage: Full rights
- Commissioned: Check contract
- Licensed stock: Follow terms

---

## Result

**Before**: SVG/Lottie illustrations  
**After**: REAL delivery video background  

**Effect**: Cinematic Amazon Prime-style authentication page with realistic motion

---

**Status**: ✅ IMPLEMENTED  
**Video Type**: Real MP4/WebM  
**Quality**: Production-Ready  
**Performance**: Optimized for Web
