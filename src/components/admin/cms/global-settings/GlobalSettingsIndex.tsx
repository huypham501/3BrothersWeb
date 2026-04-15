import Link from 'next/link';
import styled from 'styled-components';
import { CmsGlobalSetting } from '@/lib/cms/types';
import { SUPPORTED_GLOBAL_SETTINGS } from '@/lib/cms/constants/global-settings';
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
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';

interface GlobalSettingsIndexProps {
  settings: CmsGlobalSetting[];
  role: string;
}

export function GlobalSettingsIndex({ settings, role }: GlobalSettingsIndexProps) {
  return (
    <Wrapper>
      <AdminAlert>
        <AdminAlertTitle>Global Impact Warning</AdminAlertTitle>
        <AdminAlertDescription>
          Changes to global settings affect multiple public pages and metadata surfaces across the site. Save drafts safely, then publish when ready.
        </AdminAlertDescription>
        <MetaText>Your role: {role}</MetaText>
      </AdminAlert>

      <CardsGrid>
        {SUPPORTED_GLOBAL_SETTINGS.map((item) => {
          const setting = settings.find((entry) => entry.schema_key === item.schemaKey);
          const isFound = Boolean(setting);

          return (
            <AdminCard key={item.schemaKey}>
              <AdminCardHeader>
                <TitleRow>
                  <TitleText>{item.title}</TitleText>
                  {setting?.has_unpublished_changes ? (
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
                  <AdminBadge tone={setting?.published_enabled ? 'success' : 'neutral'}>
                    {setting?.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                  </AdminBadge>
                  <AdminBadge tone={setting?.enabled ? 'info' : 'neutral'}>
                    {setting?.enabled ? 'Draft: Enabled' : 'Draft: Disabled'}
                  </AdminBadge>
                </InfoRow>
                <MetaText>
                  Last edited: {setting?.last_edited_by_identifier ?? 'N/A'}
                </MetaText>
                <MetaText>
                  Last published: {setting?.last_published_by_identifier ?? 'N/A'}
                </MetaText>

                {!isFound && (
                  <AdminAlert tone="destructive">
                    <AdminAlertDescription>
                      This global setting record was not found. Seed data may be missing.
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
