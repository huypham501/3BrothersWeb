'use client';

import * as React from 'react';
import styled from 'styled-components';

const AccordionRoot = styled.div`
  width: 100%;
`;

const AccordionItemRoot = styled.div`
  border-bottom: 1px solid #e2e8f0;
`;

const AccordionTriggerButton = styled.button`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AccordionContentRoot = styled.div<{ $isOpen: boolean }>`
  overflow: hidden;
  font-size: 0.875rem;
  padding-bottom: ${({ $isOpen }) => ($isOpen ? '1rem' : '0')};
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

export const Accordion = AccordionRoot;

export const AccordionItem = AccordionItemRoot;

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isOpen?: boolean }>(
  ({ className, children, isOpen, ...props }, ref) => (
    <AccordionTriggerButton ref={ref} className={className} {...props}>
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          height: '1rem',
          width: '1rem',
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
        }}
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </AccordionTriggerButton>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }>(
  ({ className, isOpen = false, children, ...props }, ref) => (
    <AccordionContentRoot ref={ref} className={className} $isOpen={isOpen} {...props}>
      <div>{children}</div>
    </AccordionContentRoot>
  )
);
AccordionContent.displayName = "AccordionContent";

// Helper component for simple usage
export function SimpleAccordion({ title, children, defaultOpen = false }: { title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <AccordionItem>
      <AccordionTrigger isOpen={isOpen} onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}>
        {title}
      </AccordionTrigger>
      <AccordionContent isOpen={isOpen}>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
