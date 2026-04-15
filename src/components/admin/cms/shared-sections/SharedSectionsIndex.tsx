import Link from 'next/link';
import styled from 'styled-components';
import { CmsSharedSection } from '@/lib/cms/types';
import { SUPPORTED_SHARED_SECTIONS, SupportedSharedSchemaKey } from '@/lib/cms/constants/shared-sections';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardDescription,
  AdminCardHeader,
} from '@/components/admin/layout/AdminPrimitives';

interface SharedSectionsIndexProps {
  sections: CmsSharedSection[];
  usageMap: Record<SupportedSharedSchemaKey, string[]>;
  role: string;
}

export function SharedSectionsIndex({ sections, usageMap, role }: SharedSectionsIndexProps) {
  return (
    <Wrapper>
      <AdminAlert>
        <AdminAlertTitle>Cross-Page Impact Warning</AdminAlertTitle>
        <AdminAlertDescription>
          Shared sections are reused by multiple routes. Saving keeps changes in draft only; publishing updates every affected route.
        </AdminAlertDescription>
        <MetaText>Your role: {role}</MetaText>
      </AdminAlert>

      <CardsGrid>
        {SUPPORTED_SHARED_SECTIONS.map((item) => {
          const section = sections.find((entry) => entry.schema_key === item.schemaKey);
          const affectedRoutes = usageMap[item.schemaKey] ?? [];
          const isFound = Boolean(section);

          return (
            <AdminCard key={item.schemaKey}>
              <AdminCardHeader>
                <TitleRow>
                  <TitleText>{item.title}</TitleText>
                  {section?.has_unpublished_changes ? (
                    <AdminBadge tone="warning">Has Unpublished Changes</AdminBadge>
                  ) : (
                    <AdminBadge>No Unpublished Changes</AdminBadge>
                  )}
                </TitleRow>
                <AdminCardDescription>{item.description}</AdminCardDescription>
              </AdminCardHeader>

              <AdminCardContent>
                <InfoRow>
                  <AdminBadge>{item.schemaKey}</AdminBadge>
                  <AdminBadge tone={section?.published_enabled ? 'success' : 'neutral'}>
                    {section?.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                  </AdminBadge>
                  <AdminBadge tone={section?.enabled ? 'info' : 'neutral'}>
                    {section?.enabled ? 'Draft: Enabled' : 'Draft: Disabled'}
                  </AdminBadge>
                  <AdminBadge>{affectedRoutes.length} affected routes</AdminBadge>
                </InfoRow>
                <MetaText>
                  Last edited: {section?.last_edited_by_identifier ?? 'N/A'}
                </MetaText>
                <MetaText>
                  Last published: {section?.last_published_by_identifier ?? 'N/A'}
                </MetaText>

                <RouteList>
                  {affectedRoutes.map((route) => (
                    <AdminBadge key={`${item.schemaKey}-${route}`}>
                      {route}
                    </AdminBadge>
                  ))}
                </RouteList>

                {!isFound && (
                  <AdminAlert tone="destructive">
                    <AdminAlertDescription>
                      This shared section record was not found. Seed data may be missing.
                    </AdminAlertDescription>
                  </AdminAlert>
                )}

                {isFound ? (
                  <AdminButton href={item.editorPath}>Edit</AdminButton>
                ) : (
                  <AdminButton disabled>Edit</AdminButton>
                )}
              </AdminCardContent>
            </AdminCard>
          );
        })}
      </CardsGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CardsGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TitleText = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const MetaText = styled.p`
  margin: 0 0 8px;
  font-size: 0.75rem;
  color: #64748b;
`;

const RouteList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 12px;
`;
