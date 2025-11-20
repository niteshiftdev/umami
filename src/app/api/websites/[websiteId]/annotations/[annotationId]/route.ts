import { canUpdateWebsite } from '@/permissions';
import { parseRequest } from '@/lib/request';
import { json, notFound, unauthorized } from '@/lib/response';
import { deleteAnnotation } from '@/queries/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ websiteId: string; annotationId: string }> },
) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { websiteId, annotationId } = await params;

  if (!(await canUpdateWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const removed = await deleteAnnotation(annotationId, websiteId);

  if (!removed) {
    return notFound();
  }

  return json({ success: true });
}
