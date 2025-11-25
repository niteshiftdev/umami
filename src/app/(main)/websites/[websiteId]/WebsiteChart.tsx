import { LoadingPanel } from '@/components/common/LoadingPanel';
import { AnnotationAddButton } from './annotations/AnnotationAddButton';
import { AnnotationList } from './annotations/AnnotationList';
import { AnnotationForm } from './annotations/AnnotationForm';
import {
  useDateRange,
  useMessages,
  useModified,
  useApi,
  useWebsiteAnnotationsQuery,
} from '@/components/hooks';
import { useWebsitePageviewsQuery } from '@/components/hooks/queries/useWebsitePageviewsQuery';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { useContext, useMemo, useState } from 'react';
import { Column, Row, Text, useToast, Modal, Dialog } from '@umami/react-zen';
import { TypographyContext } from './WebsitePage';

export function WebsiteChart({
  websiteId,
  compareMode,
}: {
  websiteId: string;
  compareMode?: boolean;
}) {
  const { annotationUnderlayColor } = useContext(TypographyContext);
  const { dateRange, dateCompare } = useDateRange();
  const { startDate, endDate, unit, value } = dateRange;
  const { formatMessage, labels, messages } = useMessages();
  const { data, isLoading, isFetching, error } = useWebsitePageviewsQuery({
    websiteId,
    compare: compareMode ? dateCompare?.compare : undefined,
  });
  const { data: annotations, isLoading: annotationsLoading } =
    useWebsiteAnnotationsQuery(websiteId);
  const { touch } = useModified();
  const { toast } = useToast();
  const { del, useMutation } = useApi();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { pageviews, sessions, compare } = (data || {}) as any;
  const annotationList = annotations || [];
  const [editorTimestamp, setEditorTimestamp] = useState<Date | null>(null);

  const chartData = useMemo(() => {
    if (data) {
      const result = {
        pageviews,
        sessions,
      };

      if (compare) {
        result['compare'] = {
          pageviews: result.pageviews.map(({ x }, i) => ({
            x,
            y: compare.pageviews[i]?.y,
            d: compare.pageviews[i]?.x,
          })),
          sessions: result.sessions.map(({ x }, i) => ({
            x,
            y: compare.sessions[i]?.y,
            d: compare.sessions[i]?.x,
          })),
        };
      }

      return result;
    }
    return { pageviews: [], sessions: [] };
  }, [data, startDate, endDate, unit]);

  const deleteMutation = useMutation({
    mutationFn: (annotationId: string) => del(`/websites/${websiteId}/annotations/${annotationId}`),
  });

  const handleDelete = async (annotationId: string) => {
    setDeletingId(annotationId);
    try {
      await deleteMutation.mutateAsync(annotationId, {
        onSuccess: () => {
          touch('annotations');
          toast(formatMessage(messages.saved));
        },
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <LoadingPanel data={data} isFetching={isFetching} isLoading={isLoading} error={error}>
      <Column gap="4">
        <PageviewsChart
          key={value}
          data={chartData}
          minDate={startDate}
          maxDate={endDate}
          unit={unit}
          annotations={annotationList}
          annotationUnderlayColor={annotationUnderlayColor}
          onBarClick={setEditorTimestamp}
        />
        <Row justifyContent="space-between" alignItems="center">
          <Text fontWeight="600">{formatMessage(labels.annotations)}</Text>
          <AnnotationAddButton websiteId={websiteId} />
        </Row>
        <AnnotationList
          annotations={annotationList}
          isLoading={annotationsLoading}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      </Column>
      <Modal
        isOpen={!!editorTimestamp}
        onOpenChange={isOpen => !isOpen && setEditorTimestamp(null)}
      >
        <Dialog title={formatMessage(labels.addAnnotation)} style={{ width: 420 }}>
          <AnnotationForm
            websiteId={websiteId}
            defaultTimestamp={editorTimestamp ?? undefined}
            onSuccess={() => setEditorTimestamp(null)}
            onCancel={() => setEditorTimestamp(null)}
          />
        </Dialog>
      </Modal>
    </LoadingPanel>
  );
}
