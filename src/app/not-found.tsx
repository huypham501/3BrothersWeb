import { NotFoundV2View } from '@/components/notFound/NotFoundV2View';
import { resolvePublicLayoutData } from '@/lib/cms/resolvers/public-layout.resolver';

export default async function NotFound() {
  const layout = await resolvePublicLayoutData();
  return <NotFoundV2View header={layout.header} footer={layout.footer} />;
}
