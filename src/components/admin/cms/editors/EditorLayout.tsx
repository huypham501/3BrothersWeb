import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { FormItem } from '@/components/admin/controls/AdminForm';

const styles = {
  formStack: { display: 'flex', flexDirection: 'column', gap: 24 } as const,
  headerRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 } as const,
  toggleFormItem: { display: 'flex', alignItems: 'center', gap: 12 } as const,
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
  } as const,
  sectionStack: { display: 'flex', flexDirection: 'column', gap: 16 } as const,
  sectionHeaderRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 } as const,
  sectionTitle: { margin: 0, fontSize: 16, fontWeight: 600 } as const,
  itemCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    background: '#ffffff',
    padding: 16,
  } as const,
  footerRow: { display: 'flex', justifyContent: 'flex-end' } as const,
  errorText: { margin: 0, fontSize: 14, color: '#ff4d4f' } as const,
  borderedPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    background: '#ffffff',
    padding: 16,
  } as const,
};

export function FormStack(props: React.ComponentProps<'form'>) {
  const { style, ...rest } = props;
  return <form style={{ ...styles.formStack, ...style }} {...rest} />;
}

export function HeaderRow(props: React.ComponentProps<'div'>) {
  const { style, ...rest } = props;
  return <div style={{ ...styles.headerRow, ...style }} {...rest} />;
}

export function ToggleFormItem(props: React.ComponentProps<typeof FormItem>) {
  const { style, ...rest } = props;
  return <FormItem style={{ ...styles.toggleFormItem, ...style }} {...rest} />;
}

export function TwoColumnGrid(props: React.ComponentProps<'div'>) {
  const { style, ...rest } = props;
  return <div style={{ ...styles.twoColumnGrid, ...style }} {...rest} />;
}

export function SectionStack(props: React.ComponentProps<'div'>) {
  const { style, ...rest } = props;
  return <div style={{ ...styles.sectionStack, ...style }} {...rest} />;
}

export function SectionHeaderRow(props: React.ComponentProps<'div'>) {
  const { style, ...rest } = props;
  return <div style={{ ...styles.sectionHeaderRow, ...style }} {...rest} />;
}

export function SectionTitle(props: React.ComponentProps<'h5'>) {
  const { style, ...rest } = props;
  return <h5 style={{ ...styles.sectionTitle, ...style }} {...rest} />;
}

export function ItemCard(props: React.ComponentProps<'div'>) {
  const { style, ...rest } = props;
  return <div style={{ ...styles.itemCard, ...style }} {...rest} />;
}

export function FooterRow(props: React.ComponentProps<'div'>) {
  const { style, ...rest } = props;
  return <div style={{ ...styles.footerRow, ...style }} {...rest} />;
}

export function ErrorText(props: React.ComponentProps<'p'>) {
  const { style, ...rest } = props;
  return <p style={{ ...styles.errorText, ...style }} {...rest} />;
}

export function SelectInput({ style, ...props }: SelectProps) {
  return <Select style={{ width: '100%', ...style }} {...props} />;
}

export function BorderedPanel(props: React.ComponentProps<'div'>) {
  const { style, ...rest } = props;
  return <div style={{ ...styles.borderedPanel, ...style }} {...rest} />;
}