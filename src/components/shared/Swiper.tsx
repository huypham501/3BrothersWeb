'use client';

/**
 * Swiper Control Components
 * Navigation controls for Swiper slider
 */

import styled, { css } from 'styled-components';
import { mq } from '@/styles/mediaQueries';

interface SwiperControlsProps {
  $variant?: 'default' | 'light' | 'static' | 'align';
}


export const SwiperControls = styled.div<SwiperControlsProps>`
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 72px;
  padding-right: 72px;
  margin-top: 13px;

  ${mq.md} {
    width: 44%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 37px;
  }

  ${mq.lg} {
    margin-top: 135px;
  }

  .swiper-button-next,
  .swiper-rtl .swiper-button-prev,
  .swiper-next,
  .swiper-rtl .swiper-prev {
    right: 0;
  }

  .swiper-button-prev,
  .swiper-rtl .swiper-button-next,
  .swiper-prev,
  .swiper-rtl .swiper-next {
    left: 0;
  }

  /* Light variant */
  ${({ $variant }) =>
    $variant === 'light' &&
    css`
      .swiper-pagination-progressbar {
        background-color: rgba(236, 236, 238, 0.2);

        .swiper-pagination-progressbar-fill {
          background-color: ${({ theme }) => theme.colors.white};
        }
      }

      .swiper-button-prev:not(:hover),
      .swiper-button-next:not(:hover) {
        background-color: transparent;
        border-color: ${({ theme }) => theme.colors.white};

        &::after {
          filter: brightness(0) invert(1);
        }
      }
    `}

  /* Static variant (no absolute positioning) */
  ${({ $variant }) =>
    $variant === 'static' &&
    css`
      display: flex;
      justify-content: space-between;
      margin-top: 36px;
      padding: 0;

      .swiper-next,
      .swiper-prev {
        position: static;
        margin-top: 0;
        background-color: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .swiper-next:hover,
      .swiper-next:focus,
      .swiper-prev:hover,
      .swiper-prev:focus {
        border-color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.white};

        &::after {
          filter: brightness(0) saturate(100%);
        }
      }
    `}

  /* Align variant (arrows outside container) */
  ${({ $variant }) =>
    $variant === 'align' &&
    css`
      .swiper-button-next,
      .swiper-next {
        right: 0;

        ${mq.xxl} {
          right: -72px;
        }
      }

      .swiper-button-prev,
      .swiper-prev {
        left: 0;

        ${mq.xxl} {
          left: -72px;
        }
      }
    `}
`;

export const SwiperButton = styled.button`
  position: absolute;
  top: 50%;
  margin-top: -20px;
  z-index: ${({ theme }) => theme.zIndex.base};
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.textDisabled};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.easeInOut};

  &::after {
    content: '';
    width: 7px;
    height: 10px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary};

    &::after {
      filter: brightness(0) invert(1);
    }
  }

  &:disabled,
  &.swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SwiperButtonPrev = styled(SwiperButton)`
  left: 0;

  &::after {
    background-image: url("data:image/svg+xml,%3Csvg width='7' height='10' viewBox='0 0 7 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 1L1 5L6 9' stroke='%239B9DA9' stroke-width='2'/%3E%3C/svg%3E");
  }

  &:hover::after {
    background-image: url("data:image/svg+xml,%3Csvg width='7' height='10' viewBox='0 0 7 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 1L1 5L6 9' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
  }
`;

export const SwiperButtonNext = styled(SwiperButton)`
  right: 0;

  &::after {
    background-image: url("data:image/svg+xml,%3Csvg width='7' height='10' viewBox='0 0 7 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 5L1 9' stroke='%239B9DA9' stroke-width='2'/%3E%3C/svg%3E");
  }

  &:hover::after {
    background-image: url("data:image/svg+xml,%3Csvg width='7' height='10' viewBox='0 0 7 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 5L1 9' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
  }
`;

export const SwiperCounter = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  ${mq.md} {
    display: none;
  }

  .count {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SwiperPagination = styled.div`
  position: static;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.border};

  .swiper-pagination-progressbar-fill {
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    top: auto;
    bottom: 0;
  }
`;
