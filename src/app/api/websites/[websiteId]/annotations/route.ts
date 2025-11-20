import { canUpdateWebsite, canViewWebsite } from '@/permissions';
import { uuid } from '@/lib/crypto';
import { parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';
import { dateRangeParams } from '@/lib/schema';
import { createAnnotation, getWebsiteAnnotations } from '@/queries/prisma';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const schema = z.object({
    ...dateRangeParams,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const annotations = await getWebsiteAnnotations(websiteId, {
    startAt: query.startAt ? new Date(Number(query.startAt)) : undefined,
    endAt: query.endAt ? new Date(Number(query.endAt)) : undefined,
  });

  return json(annotations);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const schema = z.object({
    title: z.string().min(1).max(200),
    timestamp: z.coerce.date(),
    description: z.string().max(1000).optional(),
    color: z.string().max(20).optional(),
    icon: z.string().max(50).optional(),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canUpdateWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const annotation = await createAnnotation({
    id: uuid(),
    websiteId,
    createdBy: auth.user.id,
    title: body.title,
    description: body.description,
    color: body.color,
    icon: body.icon,
    timestamp: body.timestamp,
  });

  return json(annotation);
}
