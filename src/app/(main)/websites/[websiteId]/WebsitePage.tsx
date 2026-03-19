'use client';
import { useDynamicColor, useDynamicVariant } from '@niteshift/dials';
import { Column } from '@umami/react-zen';
import { createContext, useEffect } from 'react';
import { ExpandedViewModal } from '@/app/(main)/websites/[websiteId]/ExpandedViewModal';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteControls } from './WebsiteControls';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';
import { WebsitePanels } from './WebsitePanels';

export const TypographyContext = createContext<{
  metricLabelSize?: string;
  metricValueSize?: string;
  metricLabelWeight?: string;
  metricValueWeight?: string;
  metricLabelColor?: string;
  metricValueColor?: string;
  sectionHeadingSize?: string;
  sectionHeadingWeight?: string;
  sectionHeadingColor?: string;
}>({});

export function WebsitePage({ websiteId }: { websiteId: string }) {
  // Metric Typography Controls
  const metricLabelSize = useDynamicVariant('metric-label-size', {
    label: 'Metric Label Size',
    description: 'Font size for metric labels (Visitors, Views, etc.)',
    default: '',
    options: ['', '0', '1', '2', '3', '4'] as const,
    group: 'Typography - Metrics',
  });

  const metricValueSize = useDynamicVariant('metric-value-size', {
    label: 'Metric Value Size',
    description: 'Font size for metric values (numbers)',
    default: '8',
    options: ['4', '5', '6', '7', '8', '9'] as const,
    group: 'Typography - Metrics',
  });

  const metricLabelWeight = useDynamicVariant('metric-label-weight', {
    label: 'Metric Label Weight',
    description: 'Font weight for metric labels',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Metrics',
  });

  const metricValueWeight = useDynamicVariant('metric-value-weight', {
    label: 'Metric Value Weight',
    description: 'Font weight for metric values',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Metrics',
  });

  const metricLabelColor = useDynamicColor('metric-label-color', {
    label: 'Metric Label Color',
    description: 'Text color for metric labels',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  const metricValueColor = useDynamicColor('metric-value-color', {
    label: 'Metric Value Color',
    description: 'Text color for metric values',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  // Section Heading Controls
  const sectionHeadingSize = useDynamicVariant('section-heading-size', {
    label: 'Section Heading Size',
    description: 'Font size for section headings (Pages, Sources, etc.)',
    default: '2',
    options: ['1', '2', '3', '4', '5'] as const,
    group: 'Typography - Headings',
  });

  const sectionHeadingWeight = useDynamicVariant('section-heading-weight', {
    label: 'Section Heading Weight',
    description: 'Font weight for section headings',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Headings',
  });

  const sectionHeadingColor = useDynamicColor('section-heading-color', {
    label: 'Section Heading Color',
    description: 'Text color for section headings',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Headings',
  });

  const typographyConfig = {
    metricLabelSize,
    metricValueSize,
    metricLabelWeight,
    metricValueWeight,
    metricLabelColor,
    metricValueColor,
    sectionHeadingSize,
    sectionHeadingWeight,
    sectionHeadingColor,
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Freckle+Face&family=Shadows+Into+Light&family=Fredoka+One&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <div
        style={{
          padding: '20px',
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,107,53,0.03) 10px, rgba(255,107,53,0.03) 20px)',
          minHeight: '100vh',
          fontFamily: '"Fredoka One", cursive, sans-serif',
        }}
      >
        <Column gap>
          <div
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #e3b505 50%, #568203 100%)',
              borderRadius: '30px',
              padding: '20px 30px',
              marginBottom: '20px',
              boxShadow: '8px 8px 0 #8b4513, inset 0 0 30px rgba(255,255,255,0.3)',
              border: '4px solid #8b4513',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <h1
              style={{
                fontFamily: '"Freckle Face", cursive',
                fontSize: '2.5rem',
                color: '#fff8dc',
                textShadow: '3px 3px 0 #8b4513',
                margin: 0,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Website Analytics
            </h1>
            <span
              style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                fontSize: '2rem',
                opacity: 0.3,
                zIndex: 0,
              }}
            >
              ✿
            </span>
            <span
              style={{
                position: 'absolute',
                top: '30%',
                right: '10%',
                fontSize: '2rem',
                opacity: 0.3,
                zIndex: 0,
              }}
            >
              ❀
            </span>
            <span
              style={{
                position: 'absolute',
                bottom: '20%',
                left: '15%',
                fontSize: '2rem',
                opacity: 0.3,
                zIndex: 0,
              }}
            >
              ✿
            </span>
            <span
              style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                fontSize: '2rem',
                opacity: 0.3,
                zIndex: 0,
              }}
            >
              ❀
            </span>
          </div>
          <div
            style={{
              background:
                'linear-gradient(90deg, #8b4513 0%, #6b4c9a 25%, #008080 50%, #568203 75%, #ff6b35 100%)',
              borderRadius: '50px',
              border: '3px solid #fff8dc',
              boxShadow: '5px 5px 0 rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.2)',
              padding: '15px 20px',
            }}
          >
            <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
          </div>
          <div
            style={{
              background: '#fff8dc',
              borderRadius: '20px',
              border: '5px solid #ff6b35',
              boxShadow: '10px 10px 0 #8b4513, inset 0 0 50px rgba(139, 69, 19, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Panel
              minHeight="520px"
              style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
            >
              <WebsiteChart websiteId={websiteId} />
            </Panel>
          </div>
          <div
            style={{
              background: '#fff8dc',
              borderRadius: '15px',
              border: '3px dashed #568203',
              padding: '20px',
              marginTop: '20px',
              boxShadow: '5px 5px 0 #8b4513',
            }}
          >
            <WebsiteControls websiteId={websiteId} />
          </div>
          <div
            style={{
              background: '#fff8dc',
              borderRadius: '15px',
              border: '3px dashed #568203',
              padding: '20px',
              marginTop: '20px',
              boxShadow: '5px 5px 0 #8b4513',
            }}
          >
            <WebsitePanels websiteId={websiteId} />
          </div>
          <ExpandedViewModal websiteId={websiteId} />
        </Column>
      </div>
    </TypographyContext.Provider>
  );
}
