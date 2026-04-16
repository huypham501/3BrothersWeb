'use client';

import * as React from 'react';
import { Collapse } from 'antd';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

type AccordionProps = {
  children: React.ReactNode;
  collapsible?: boolean;
};

type AccordionItemProps = {
  value: string;
  children: React.ReactNode;
};

type AccordionSectionProps = {
  children: React.ReactNode;
};

type MarkedAccordionComponent = React.FC<AccordionSectionProps> & {
  __kind?: 'trigger' | 'content';
};

export function Accordion({ children, collapsible }: AccordionProps) {
  const items = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => {
      const itemElement = child as React.ReactElement<AccordionItemProps>;
      const parts = React.Children.toArray(itemElement.props.children).filter(React.isValidElement) as Array<
        React.ReactElement<AccordionSectionProps>
      >;

      const trigger = parts.find((part) => (part.type as MarkedAccordionComponent).__kind === 'trigger');
      const content = parts.find((part) => (part.type as MarkedAccordionComponent).__kind === 'content');

      return {
        key: itemElement.props.value,
        label: trigger?.props.children ?? itemElement.props.value,
        children: content?.props.children ?? null,
      };
    });

  return (
    <Collapse
      accordion={!collapsible}
      items={items}
      expandIcon={({ isActive }) => (isActive ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />)}
    />
  );
}

export function AccordionItem({ children }: AccordionItemProps) {
  return <>{children}</>;
}

export const AccordionTrigger: MarkedAccordionComponent = ({ children }) => {
  return <>{children}</>;
};

AccordionTrigger.__kind = 'trigger';

export const AccordionContent: MarkedAccordionComponent = ({ children }) => {
  return <>{children}</>;
}

AccordionContent.__kind = 'content';
