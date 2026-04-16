'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsSharedSection, sharedExclusiveTalentsSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveSharedSection, publishSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
} from '@/components/admin/layout/AdminPrimitives';

type FormValues = z.infer<typeof sharedExclusiveTalentsSchema> & { enabled: boolean };

interface SharedExclusiveTalentsManagerProps {
  section: CmsSharedSection<z.infer<typeof sharedExclusiveTalentsSchema>>;
  usageRoutes: string[];
  role: string;
  canPublish: boolean;
}

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function SharedExclusiveTalentsManager({
  section,
  usageRoutes,
  role,
  canPublish,
}: SharedExclusiveTalentsManagerProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(sharedExclusiveTalentsSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content?.section_title || '',
      featured_name: section.content?.featured_name || '',
      featured_handle: section.content?.featured_handle || '',
      featured_photo: section.content?.featured_photo || '',
      featured_photo_alt: section.content?.featured_photo_alt || '',
      featured_description: section.content?.featured_description || '',
      featured_stats: section.content?.featured_stats?.length
        ? section.content.featured_stats
        : [
            { label: '', value: '' },
            { label: '', value: '' },
          ],
      talent_count_label: section.content?.talent_count_label || '',
      talents: section.content?.talents?.length ? section.content.talents : [{ name: '', photo: '', photo_alt: '' }],
    },
  });

  const { fields: statFields } = useFieldArray({
    control: form.control,
    name: 'featured_stats',
  });

  const { fields: talentFields, append: appendTalent, remove: removeTalent } = useFieldArray({
    control: form.control,
    name: 'talents',
  });

  const clearFlash = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFlash();

    try {
      const { enabled, ...payload } = values;
      await saveSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS, payload, enabled);
      setSuccessMsg('Exclusive Talents draft saved. Changes are not live until publish.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    clearFlash();

    try {
      const values = form.getValues();
      if (form.formState.isDirty) {
        const { enabled, ...payload } = values;
        await saveSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS, payload, enabled);
      }

      await publishSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS);
      setSuccessMsg('Exclusive Talents published and affected routes revalidated.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Form {...form}>
      <FormRoot onSubmit={form.handleSubmit(onSaveDraft)}>
        <AdminAlert>
          <AdminAlertTitle>Cross-Page Impact Warning</AdminAlertTitle>
          <AdminAlertDescription>
            This shared section is used by multiple routes. Publish will update all routes listed below.
          </AdminAlertDescription>
          <BadgeRow>
            {usageRoutes.map((route) => (
              <AdminBadge key={`exclusive-${route}`}>{route}</AdminBadge>
            ))}
          </BadgeRow>
        </AdminAlert>

        {errorMsg && (
          <AdminAlert tone="destructive">
            <AdminAlertDescription>{errorMsg}</AdminAlertDescription>
          </AdminAlert>
        )}

        {successMsg && (
          <AdminAlert>
            <AdminAlertDescription>{successMsg}</AdminAlertDescription>
          </AdminAlert>
        )}

        <SectionCard>
          <ActionHeader>
            <MetaGroup>
              <BadgeRow>
                <AdminBadge>{section.schema_key}</AdminBadge>
                <AdminBadge tone={section.published_enabled ? 'success' : 'neutral'}>
                  {section.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                </AdminBadge>
                <AdminBadge tone={section.has_unpublished_changes ? 'warning' : 'neutral'}>
                  {section.has_unpublished_changes ? 'Has Unpublished Changes' : 'No Unpublished Changes'}
                </AdminBadge>
              </BadgeRow>
              <MetaText>Your role: {role}</MetaText>
              <MetaText>
                Last edited: {section.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_edited_at)}
              </MetaText>
              <MetaText>
                Last published: {section.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_published_at)}
              </MetaText>
            </MetaGroup>

            <ButtonGroup>
              <AdminButton type="submit" variant="outline" disabled={isSaving || isPublishing || !form.formState.isDirty}>
                {isSaving ? 'Saving Draft...' : 'Save Draft'}
              </AdminButton>
              <AdminButton
                type="button"
                onClick={handlePublish}
                disabled={isSaving || isPublishing || !canPublish}
                title={canPublish ? undefined : 'Your role cannot publish.'}
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </AdminButton>
            </ButtonGroup>
          </ActionHeader>

          <Divider />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <ToggleFormItem>
                <div>
                  <FormLabel>Enable Shared Section</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </ToggleFormItem>
            )}
          />
        </SectionCard>

        <FormField
          control={form.control}
          name="section_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <BlockCard>
          <BlockTitle>Featured Talent</BlockTitle>

          <TwoColumnGrid>
            <FormField
              control={form.control}
              name="featured_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TwoColumnGrid>

          <TwoColumnGrid>
            <FormField
              control={form.control}
              name="featured_photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Photo URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_photo_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Photo Alt</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TwoColumnGrid>

          <FormField
            control={form.control}
            name="featured_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={6} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Block>
            <SubTitle>Featured Stats (exactly 2)</SubTitle>
            <StatsGrid>
              {statFields.map((stat, index) => (
                <EditableRow key={stat.id}>
                  <FormField
                    control={form.control}
                    name={`featured_stats.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`featured_stats.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </EditableRow>
              ))}
            </StatsGrid>
          </Block>
        </BlockCard>

        <BlockCard>
          <BlockHeader>
            <BlockTitle>Talent Grid Items</BlockTitle>
            <AdminButton type="button" variant="outline" onClick={() => appendTalent({ name: '', photo: '', photo_alt: '' })}>
              Add Talent
            </AdminButton>
          </BlockHeader>

          <FormField
            control={form.control}
            name="talent_count_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Talent Count Label</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="50+ TALENTS" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {talentFields.map((talent, index) => (
            <TalentRow key={talent.id}>
              <FormField
                control={form.control}
                name={`talents.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`talents.${index}.photo`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`talents.${index}.photo_alt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo Alt</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <RowActions>
                <AdminButton
                  type="button"
                  variant="outline"
                  onClick={() => removeTalent(index)}
                  disabled={talentFields.length <= 1}
                >
                  Remove
                </AdminButton>
              </RowActions>
            </TalentRow>
          ))}
        </BlockCard>
      </FormRoot>
    </Form>
  );
}

const FormRoot = (props: React.ComponentProps<'form'>) => <form {...props} />;
const SectionCard = (props: React.ComponentProps<'div'>) => <div {...props} />;
const ActionHeader = (props: React.ComponentProps<'div'>) => <div {...props} />;
const MetaGroup = (props: React.ComponentProps<'div'>) => <div {...props} />;
const BadgeRow = (props: React.ComponentProps<'div'>) => <div {...props} />;
const MetaText = (props: React.ComponentProps<'p'>) => <p {...props} />;
const ButtonGroup = (props: React.ComponentProps<'div'>) => <div {...props} />;
const Divider = (props: React.ComponentProps<'hr'>) => <hr {...props} />;
const ToggleFormItem = (props: React.ComponentProps<typeof FormItem>) => (
  <FormItem {...props} />
);
const BlockCard = (props: React.ComponentProps<'div'>) => <div {...props} />;
const Block = (props: React.ComponentProps<'div'>) => <div {...props} />;
const BlockHeader = (props: React.ComponentProps<'div'>) => <div {...props} />;
const BlockTitle = (props: React.ComponentProps<'h3'>) => <h3 {...props} />;
const SubTitle = (props: React.ComponentProps<'h4'>) => <h4 {...props} />;
const TwoColumnGrid = (props: React.ComponentProps<'div'>) => <div {...props} />;
const StatsGrid = (props: React.ComponentProps<'div'>) => <div {...props} />;
const EditableRow = (props: React.ComponentProps<'div'>) => <div {...props} />;
const TalentRow = (props: React.ComponentProps<'div'>) => <div {...props} />;
const RowActions = (props: React.ComponentProps<'div'>) => <div {...props} />;
