# CryptoPay Landing Page

A modern, animated landing page for a crypto payment platform inspired by FacilPay.

## Access the Page

Visit `/crypto` in your browser to see the new landing page.

## Features

### Visual Design
- **Dark Theme**: Modern slate-950 background with cyan/blue gradient accents
- **Smooth Animations**: Fade-in, slide-up effects with staggered timing
- **Floating Elements**: Animated gradient orbs in the background
- **Responsive Design**: Fully responsive from mobile to desktop

### Sections

1. **Hero Section**
   - Animated headline with gradient text
   - Statistics counters (Transaction Volume, Active Users, Countries)
   - Call-to-action buttons
   - Floating background elements with pulse animation
   - Scroll indicator

2. **Features Grid**
   - 4 feature cards with icons:
     - Lightning Fast
     - Bank-Grade Security
     - Global Access
     - AI Powered
   - Hover effects with scale transform

3. **Multi-Chain Support**
   - 12 blockchain logos in a responsive grid
   - Hover animations on each blockchain card

4. **Benefits Section**
   - Two-column layout
   - Feature checklist with checkmarks
   - Interactive payment mockup card
   - Real-time transaction preview

5. **Security Section**
   - 3 security features with detailed descriptions
   - Icon badges with gradient backgrounds

6. **Call-to-Action**
   - Gradient background card
   - Dual CTA buttons

7. **Footer**
   - Multi-column layout
   - Product and company links
   - Copyright and legal links

### Animations

All animations are defined in `tailwind.config.js`:

- `fade-in`: Smooth opacity transition
- `fade-in-up`: Opacity + upward slide
- `float`: Continuous floating motion
- `pulse-slow`: Gentle pulsing effect

Animation delays are applied using inline styles for precise timing.

## Technical Details

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **No external animation libraries**: Pure CSS animations via Tailwind

## Customization

### Colors
Main colors are defined in the gradients:
- Primary: `from-cyan-400 to-blue-600`
- Secondary: `from-cyan-500 to-blue-600`
- Background: `bg-slate-950`

### Content
Edit `src/pages/CryptoLanding.tsx` to modify:
- Text content
- Statistics numbers
- Feature descriptions
- Blockchain list
- Benefits checklist

### Animations
Modify animation timing in `tailwind.config.js` under the `animation` and `keyframes` sections.

## Performance

- Optimized images (using WebP would further improve)
- Lazy loading ready
- Minimal JavaScript
- CSS-based animations for better performance

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers
