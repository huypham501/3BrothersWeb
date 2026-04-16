'use client';

import { Switch } from 'antd';

type AdminSwitchProps = Omit<React.ComponentProps<typeof Switch>, 'size'> & {
  size?: 'sm' | 'default';
  onCheckedChange?: (checked: boolean) => void;
};

export function AdminSwitch({ size = 'default', onCheckedChange, ...props }: AdminSwitchProps) {
  const delegatedOnChange = props.onChange as ((checked: boolean, event: unknown) => void) | undefined;

  const handleChange = (checked: boolean, event: unknown) => {
    onCheckedChange?.(checked);
    delegatedOnChange?.(checked, event);
  };

  return (
    <Switch
      {...props}
      size={size === 'sm' ? 'small' : 'default'}
      onChange={handleChange}
    />
  );
}
