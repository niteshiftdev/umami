import prisma from '@/lib/prisma';

interface AnnotationFilters {
  startAt?: Date;
  endAt?: Date;
}

export function getWebsiteAnnotations(websiteId: string, filters: AnnotationFilters = {}) {
  const { startAt, endAt } = filters;

  return prisma.client.annotation.findMany({
    where: {
      websiteId,
      timestamp: {
        gte: startAt,
        lte: endAt,
      },
    },
    orderBy: { timestamp: 'asc' },
  });
}

export function createAnnotation(
  data: Parameters<typeof prisma.client.annotation.create>[0]['data'],
) {
  return prisma.client.annotation.create({ data });
}

export async function deleteAnnotation(annotationId: string, websiteId: string) {
  const result = await prisma.client.annotation.deleteMany({
    where: {
      id: annotationId,
      websiteId,
    },
  });

  return result.count > 0;
}
