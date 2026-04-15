import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type UiVariant =
  | NonNullable<VariantProps<typeof buttonVariants>['variant']>
  | 'gradient'
  | 'outlineLight';
type UiSize = NonNullable<VariantProps<typeof buttonVariants>['size']> | 'xl';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: UiVariant;
  size?: UiSize;
  asChild?: boolean;
  as?: React.ElementType;
  href?: string;
  $variant?: UiVariant;
  $size?: UiSize;
  $rounded?: boolean;
  $fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      as,
      $variant,
      $size,
      $rounded = false,
      $fullWidth = false,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant ?? $variant;
    const resolvedSize = size ?? $size;

    const normalizedVariant: VariantProps<typeof buttonVariants>['variant'] =
      resolvedVariant === 'gradient' ? 'default' : resolvedVariant === 'outlineLight' ? 'outline' : resolvedVariant;
    const normalizedSize: VariantProps<typeof buttonVariants>['size'] =
      resolvedSize === 'xl' ? 'lg' : resolvedSize;

    const variantCompatClass =
      resolvedVariant === 'gradient'
        ? 'bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow hover:opacity-90'
        : resolvedVariant === 'outlineLight'
          ? 'border-white/60 text-white hover:bg-white/10'
          : '';
    const sizeCompatClass = resolvedSize === 'xl' ? 'h-12 px-8 text-base' : '';
    const roundedClass = $rounded ? 'rounded-full' : '';
    const fullWidthClass = $fullWidth ? 'w-full' : '';

    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ variant: normalizedVariant, size: normalizedSize }),
            variantCompatClass,
            sizeCompatClass,
            roundedClass,
            fullWidthClass,
            className
          )}
          ref={ref as React.Ref<HTMLElement>}
          {...props}
        />
      );
    }

    const Comp: React.ElementType = as ?? 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({ variant: normalizedVariant, size: normalizedSize }),
          variantCompatClass,
          sizeCompatClass,
          roundedClass,
          fullWidthClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
