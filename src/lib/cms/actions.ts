'use server';

import { createSupabaseServerClient } from './supabase/server';
import { CMS_REGISTRY } from './schemas';
import { SCHEMA_KEYS } from './constants/schema-keys';
import { homePageSchema } from './schemas';
import { z } from 'zod';

export async function saveHomePageSettings(pageId: string, payload: any) {
  const supabase = await createSupabaseServerClient();
  
  // Validate payload
  const validatedData = homePageSchema.parse(payload);
  
  const { error } = await supabase
    .from('pages')
    .update({
      internal_name: validatedData.internal_name,
      status: validatedData.status,
      seo_title: validatedData.seo_title,
      seo_description: validatedData.seo_description,
      og_image: validatedData.og_image,
      og_image_alt: validatedData.og_image_alt,
      canonical_url: validatedData.canonical_url,
      keywords: validatedData.keywords,
    })
    .eq('id', pageId);

  if (error) {
    console.error("Error saving page settings:", error);
    throw new Error("Failed to save page settings.");
  }
}

export async function savePageSection(pageId: string, schemaKey: string, payload: any, enabled?: boolean) {
  const supabase = await createSupabaseServerClient();
  
  // Validate payload based on registry
  const schema = CMS_REGISTRY[schemaKey];
  if (!schema) {
    throw new Error(`No validation schema found for ${schemaKey}`);
  }
  
  const validatedContent = schema.parse(payload);
  
  const updateData: any = {
    content: validatedContent,
  };
  if (enabled !== undefined) {
    updateData.enabled = enabled;
  }

  const { error } = await supabase
    .from('page_sections')
    .update(updateData)
    .eq('page_id', pageId)
    .eq('schema_key', schemaKey);

  if (error) {
    console.error(`Error saving page section ${schemaKey}:`, error);
    throw new Error(`Failed to save section ${schemaKey}.`);
  }
}

export async function saveSharedSection(schemaKey: string, payload: any, enabled?: boolean) {
  const supabase = await createSupabaseServerClient();
  
  // Validate payload based on registry
  const schema = CMS_REGISTRY[schemaKey];
  if (!schema) {
    throw new Error(`No validation schema found for ${schemaKey}`);
  }
  
  const validatedContent = schema.parse(payload);
  
  const updateData: any = {
    content: validatedContent,
  };
  if (enabled !== undefined) {
    updateData.enabled = enabled;
  }

  const { error } = await supabase
    .from('shared_sections')
    .update(updateData)
    .eq('schema_key', schemaKey);

  if (error) {
    console.error(`Error saving shared section ${schemaKey}:`, error);
    throw new Error(`Failed to save shared section ${schemaKey}.`);
  }
}
