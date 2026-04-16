'use client';

import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number | string;
}

export function LocationIcon({ color = 'currentColor', size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 1.333A4.667 4.667 0 0 0 3.333 6c0 3.5 4.667 8.667 4.667 8.667S12.667 9.5 12.667 6A4.667 4.667 0 0 0 8 1.333z"
        stroke={color}
        strokeWidth="1.167"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke={color} strokeWidth="1.167" />
    </svg>
  );
}

export function ClockIcon({ color = 'currentColor', size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.167" />
      <path d="M8 5v3.5l2 1.5" stroke={color} strokeWidth="1.167" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon({ color = 'currentColor', size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.833" y="3.133" width="12.444" height="10.667" rx="1.778" stroke={color} strokeWidth="1.167" />
      <path d="M10.111 1.333v2.667M5.889 1.333v2.667M1.833 6.222h12.611" stroke={color} strokeWidth="1.167" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ color = 'currentColor', size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 10h12M10 4l6 6-6 6" stroke={color} strokeWidth="1.667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GrowIcon({ color = '#003CA6', size = 40, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 35L15 22l7 7 8-10 5 6" stroke={color} strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 15l7-7M35 8v6M35 8h-6" stroke={color} strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TeamIcon({ color = '#003CA6', size = 40, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="14" cy="13" r="5" stroke={color} strokeWidth="3.33" />
      <path d="M4 33c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={color} strokeWidth="3.33" strokeLinecap="round" />
      <circle cx="28" cy="13" r="4" stroke={color} strokeWidth="3.33" />
      <path d="M34 33c0-4.418-2.686-8-6-8" stroke={color} strokeWidth="3.33" strokeLinecap="round" />
    </svg>
  );
}

export function CreativeIcon({ color = '#003CA6', size = 40, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20 5l2.5 7.5H30l-6.25 4.5 2.5 7.5L20 20l-6.25 4.5 2.5-7.5L10 12.5h7.5L20 5z" stroke={color} strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 30h24M12 35h16" stroke={color} strokeWidth="3.33" strokeLinecap="round" />
    </svg>
  );
}

export function DepartmentIcon({ color = '#003CA6', size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3.5" y="8" width="17" height="12" rx="2" stroke={color} strokeWidth="1.75" />
      <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function TypeIcon({ color = '#003CA6', size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.75" />
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function ExperienceIcon({ color = '#003CA6', size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke={color} strokeWidth="1.75" />
      <path d="M20 21a8 8 0 0 0-16 0" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function SalaryIcon({ color = '#003CA6', size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="1.75" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.75" />
    </svg>
  );
}

export function FacebookIcon({ color = '#003CA6', size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.53-4H14V7a1 1 0 0 1 1-1h3V2z" fill={color} />
    </svg>
  );
}

export function TwitterIcon({ color = '#003CA6', size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" fill={color} />
    </svg>
  );
}

export function InstagramIcon({ color = '#003CA6', size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke={color} strokeWidth="2" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
