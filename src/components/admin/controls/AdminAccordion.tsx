'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import styled from 'styled-components';

type AccordionProps = AccordionPrimitive.Root.Props & {
  collapsible?: boolean;
};

export function Accordion({ collapsible: _collapsible, ...props }: AccordionProps) {
  return <AccordionRoot {...props} />;
}

export function AccordionItem(props: AccordionPrimitive.Item.Props) {
  return <AccordionItemRoot {...props} />;
}

export function AccordionTrigger({ children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header>
      <AccordionTriggerRoot {...props}>
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon-down" aria-hidden="true" />
        <ChevronUpIcon data-slot="accordion-trigger-icon-up" aria-hidden="true" />
      </AccordionTriggerRoot>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionContentRoot {...props}>
      <AccordionContentInner>{children}</AccordionContentInner>
    </AccordionContentRoot>
  );
}

const AccordionRoot = styled(AccordionPrimitive.Root)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const AccordionItemRoot = styled(AccordionPrimitive.Item)`
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: 0;
  }
`;

const AccordionTriggerRoot = styled(AccordionPrimitive.Trigger)`
  position: relative;
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  padding: 10px 0;
  color: #0f172a;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  outline: none;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    border-color: #334155;
    box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.16);
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }

  [data-slot='accordion-trigger-icon-down'],
  [data-slot='accordion-trigger-icon-up'] {
    margin-left: auto;
    height: 16px;
    width: 16px;
    flex-shrink: 0;
    color: #64748b;
  }

  [data-slot='accordion-trigger-icon-up'] {
    display: none;
  }

  &[aria-expanded='true'] [data-slot='accordion-trigger-icon-down'] {
    display: none;
  }

  &[aria-expanded='true'] [data-slot='accordion-trigger-icon-up'] {
    display: block;
  }
`;

const AccordionContentRoot = styled(AccordionPrimitive.Panel)`
  overflow: hidden;
  color: #334155;
  font-size: 0.875rem;
`;

const AccordionContentInner = styled.div`
  padding: 0 0 10px;

  p:not(:last-child) {
    margin-bottom: 16px;
  }

  a {
    text-underline-offset: 3px;
    text-decoration: underline;
  }

  a:hover {
    color: #0f172a;
  }
`;
