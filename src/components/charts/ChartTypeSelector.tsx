import { Button, Row } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import styles from './ChartTypeSelector.module.css';

export type ChartType = 'bar' | 'line';

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChange: (type: ChartType) => void;
}

export function ChartTypeSelector({ chartType, onChange }: ChartTypeSelectorProps) {
  const { formatMessage, labels } = useMessages();

  return (
    <Row gap="2" marginBottom="3">
      <Button
        className={chartType === 'bar' ? styles.active : ''}
        onClick={() => onChange('bar')}
        variant="ghost"
        size="sm"
      >
        {formatMessage(labels.barChart || 'Bar Chart')}
      </Button>
      <Button
        className={chartType === 'line' ? styles.active : ''}
        onClick={() => onChange('line')}
        variant="ghost"
        size="sm"
      >
        {formatMessage(labels.lineChart || 'Line Chart')}
      </Button>
    </Row>
  );
}
