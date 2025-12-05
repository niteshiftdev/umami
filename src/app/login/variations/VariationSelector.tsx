'use client';
import { useState } from 'react';
import { V1ModernGradientLogin } from './V1_ModernGradient';
import { V2GlassMorphismLogin } from './V2_GlassMorphism';
import { V3SplitScreenLogin } from './V3_SplitScreen';
import { V4OrganicNatureLogin } from './V4_OrganicNature';
import { V5NeonTechLogin } from './V5_NeonTech';
import styles from './VariationSelector.module.css';

type VariationType = 'v1' | 'v2' | 'v3' | 'v4' | 'v5';

const variations = [
  { id: 'v1', name: 'Modern Gradient', description: 'Vibrant gradient with animated blobs' },
  { id: 'v2', name: 'Glass Morphism', description: 'Dark sophisticated frosted glass effect' },
  { id: 'v3', name: 'Split Screen', description: 'Clean minimalist two-panel layout' },
  { id: 'v4', name: 'Organic Nature', description: 'Warm eco-friendly with wave elements' },
  { id: 'v5', name: 'Neon Tech', description: 'Cyberpunk futuristic terminal style' },
];

export function VariationSelector() {
  const [active, setActive] = useState<VariationType>('v1');

  const renderVariation = () => {
    switch (active) {
      case 'v1':
        return <V1ModernGradientLogin />;
      case 'v2':
        return <V2GlassMorphismLogin />;
      case 'v3':
        return <V3SplitScreenLogin />;
      case 'v4':
        return <V4OrganicNatureLogin />;
      case 'v5':
        return <V5NeonTechLogin />;
      default:
        return <V1ModernGradientLogin />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.preview}>{renderVariation()}</div>

      <div className={styles.selector}>
        <h2>Login Design Variations</h2>
        <div className={styles.buttons}>
          {variations.map((variation) => (
            <button
              key={variation.id}
              className={`${styles.button} ${active === variation.id ? styles.active : ''}`}
              onClick={() => setActive(variation.id as VariationType)}
            >
              <span className={styles.name}>{variation.name}</span>
              <span className={styles.description}>{variation.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
