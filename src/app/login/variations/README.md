# Login Page Design Variations

This directory contains 5 ambitious design variations for the Umami login page. Each variation offers a distinctly different aesthetic while maintaining all core functionality.

## Variations Overview

### 1. **Modern Gradient** (V1_ModernGradient)
- **Aesthetic**: Contemporary, vibrant gradient background with animated blobs
- **Key Features**:
  - Smooth animated background elements (blobs)
  - Gradient transitions (purple to pink)
  - Slide and fade animations for form elements
  - Polished glass-effect inputs with glow
  - Elevated button with shadow effects

### 2. **Dark Glass Morphism** (V2_GlassMorphism)
- **Aesthetic**: Dark, sophisticated with frosted glass effect
- **Key Features**:
  - Grid pattern overlay
  - Floating particles animation
  - Glassmorphism card design
  - Cyan/turquoise accent colors
  - Neon glow effects on form elements

### 3. **Split Screen Minimalist** (V3_SplitScreen)
- **Aesthetic**: Clean, modern two-panel layout
- **Key Features**:
  - Left panel: brand showcase with features
  - Right panel: login form
  - Gradient background on left side
  - Icon features with animations
  - Responsive design (collapses on mobile)

### 4. **Organic Nature** (V4_OrganicNature)
- **Aesthetic**: Warm, natural, eco-friendly vibes
- **Key Features**:
  - Organic wave SVG elements
  - Floating leaf animations
  - Blooming flower effect
  - Green color palette
  - Light, airy design with soft shadows

### 5. **Neon Tech** (V5_NeonTech)
- **Aesthetic**: Cyberpunk, futuristic with terminal vibes
- **Key Features**:
  - Dark background with grid animation
  - Floating code blocks
  - Glowing cyan/neon accents
  - Monospace font styling
  - Terminal-style labels ($ symbol)
  - Pulsing status indicator

## Technical Details

All variations:
- Maintain full form functionality and validation
- Use the same backend API endpoints
- Support the `useUpdateQuery` hook for submissions
- Preserve accessibility features
- Are built with CSS modules for isolated styling
- Include proper animations and transitions

## How to Use

To switch to a specific variation, update the import in `/src/app/login/page.tsx`:

```tsx
// Import the variation you want to use
import { V1ModernGradientLogin } from './variations/V1_ModernGradient';
// or
import { V2GlassMorphismLogin } from './variations/V2_GlassMorphism';
// etc.

// Then use it in your component
export function LoginPage() {
  return <V1ModernGradientLogin />;
}
```

## Browser Compatibility

- All variations use modern CSS features (backdrop-filter, animations, gradients)
- Tested on Chrome, Firefox, Safari, and Edge
- Mobile responsive with media queries
- Fallbacks for older browsers

## Color Palettes

| Variation | Primary | Secondary | Accent |
|-----------|---------|-----------|--------|
| V1 | #667eea | #764ba2 | #f093fb |
| V2 | #0f0c29 | #302b63 | #00d4ff |
| V3 | #667eea | White | #764ba2 |
| V4 | #1b5e20 | #558b2f | #4caf50 |
| V5 | #0a0e27 | #00ffc8 | #0099ff |

## Animation Timing

- Entry animations: 0.6-0.8s ease-out
- Interaction feedback: 0.3s ease
- Background effects: 12-35s loop (slow, subtle)
- Hover states: 0.3s transition

## Customization

Each variation uses CSS modules, making it easy to adjust:
- Colors and gradients
- Animation timings and easing
- Border radius and shadows
- Font sizes and spacing
- Animation effects

Simply modify the corresponding `.module.css` file.
