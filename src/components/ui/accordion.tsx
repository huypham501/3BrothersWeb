import * as React from 'react';
import styled from 'styled-components';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

type AccordionValue = string | string[] | undefined;

type AccordionProps = {
  children: React.ReactNode;
  className?: string;
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
  collapsible?: boolean;
};

type AccordionContextValue = {
  openValues: string[];
  toggleValue: (value: string) => void;
};

type AccordionItemContextValue = {
  value: string;
};

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);
const AccordionItemContext = React.createContext<AccordionItemContextValue | undefined>(undefined);

const toArray = (value: AccordionValue) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const AccordionRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AccordionItemRoot = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child {
    border-bottom: 0;
  }
`;

const AccordionTriggerButton = styled.button`
  width: 100%;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing[2]} 0`};
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const AccordionContentRoot = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '2000px' : '0')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    max-height ${({ theme }) => theme.motion.duration.slow} ${({ theme }) => theme.motion.easing.easeInOut},
    opacity ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};
`;

const AccordionContentInner = styled.div`
  padding: 0 0 ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textBody};
`;

function Accordion({
  children,
  className,
  value,
  defaultValue,
  onValueChange,
  collapsible = false,
}: AccordionProps) {
  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = React.useState<string[]>(toArray(defaultValue));
  const openValues = isControlled ? toArray(value) : internalValues;

  const toggleValue = (itemValue: string) => {
    const isOpen = openValues.includes(itemValue);
    const nextValues = isOpen
      ? openValues.filter((valueItem) => valueItem !== itemValue)
      : collapsible
      ? [...openValues, itemValue]
      : [itemValue];

    if (!isControlled) {
      setInternalValues(nextValues);
    }

    if (!onValueChange) {
      return;
    }

    if (collapsible) {
      onValueChange(nextValues);
    } else {
      onValueChange(nextValues[0]);
    }
  };

  return (
    <AccordionContext.Provider value={{ openValues, toggleValue }}>
      <AccordionRoot className={className}>{children}</AccordionRoot>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  value,
  children,
  ...props
}: React.ComponentProps<'div'> & { value: string }) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <AccordionItemRoot {...props}>{children}</AccordionItemRoot>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const accordionContext = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error('AccordionTrigger must be used inside Accordion and AccordionItem.');
  }

  const isOpen = accordionContext.openValues.includes(itemContext.value);

  return (
    <AccordionTriggerButton
      type="button"
      aria-expanded={isOpen}
      onClick={() => accordionContext.toggleValue(itemContext.value)}
      {...props}
    >
      {children}
      {isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
    </AccordionTriggerButton>
  );
}

function AccordionContent({ children, ...props }: React.ComponentProps<'div'>) {
  const accordionContext = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error('AccordionContent must be used inside Accordion and AccordionItem.');
  }

  const isOpen = accordionContext.openValues.includes(itemContext.value);

  return (
    <AccordionContentRoot $open={isOpen} aria-hidden={!isOpen} {...props}>
      <AccordionContentInner>{children}</AccordionContentInner>
    </AccordionContentRoot>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
