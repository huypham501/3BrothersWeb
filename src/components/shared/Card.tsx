'use client';

/**
 * Card Components
 * Content cards with image, title, meta, and text
 */

import styled, { css } from 'styled-components';
import { mq } from '@/styles/mediaQueries';

export const Card = styled.div<{ $variant?: 'default' | 'flex' | 'main' }>`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${({ $variant }) =>
    $variant === 'flex' &&
    css`
      display: flex;

      ${mq.md} {
        .card-img {
          flex: 0 0 35%;
          max-width: 35%;
          margin-bottom: 0;
        }

        .card-body {
          flex: 0 0 65%;
          max-width: 65%;
          padding-left: ${({ theme }) => theme.spacing.xl};
        }
      }
    `}

  ${({ $variant }) =>
    $variant === 'main' &&
    css`
      margin-bottom: ${({ theme }) => theme.spacing.xl};

      ${mq.md} {
        margin-bottom: 80px;
      }

      ${mq.lg} {
        margin-bottom: 0;
      }

      .card-title {
        margin-bottom: ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
        line-height: 1.35;
        height: auto;

        ${mq.lg} {
          font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
          font-family: ${({ theme }) => theme.typography.fontFamily.heading};
        }
      }

      .card-img {
        margin-bottom: ${({ theme }) => theme.spacing.md};

        ${mq.md} {
          margin-bottom: ${({ theme }) => theme.spacing.lg};
        }
      }
    `}
`;

export const CardImg = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  a {
    display: block;
    position: relative;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.16);
      transition: all ease-out ${({ theme }) => theme.motion.duration.base};
      visibility: hidden;
    }

    &:hover::after {
      visibility: visible;
    }
  }
`;

export const CardImgTop = styled.img`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  height: auto;
`;

export const CardBody = styled.div`
  /* Spacing handled by parent Card */
`;

export const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  line-height: 1.4;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    line-height: 1.6;
    margin-bottom: 8px;
    height: 64px;
    overflow: hidden;
  }

  ${mq.lg} {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const CardMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.69;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  > * {
    display: inline-block;
  }

  .timer {
    margin-left: 23px;
  }
`;

export const CardText = styled.p`
  margin-top: 12px;
  line-height: 1.7;

  ${mq.md} {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
`;

// Card Flex variant (for blog list)
export const CardFlex = styled(Card)`
  display: flex;

  ${CardImg} {
    width: 120px;
    margin-bottom: 0;

    ${mq.md} {
      width: 118px;
    }

    ${mq.lg} {
      width: 160px;
    }
  }

  ${CardBody} {
    width: calc(100% - 120px);
    padding-left: 20px;

    ${mq.md} {
      width: calc(100% - 118px);
    }

    ${mq.lg} {
      width: calc(100% - 160px);
    }
  }

  ${CardImgTop} {
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  ${CardTitle} {
    height: auto;
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    line-height: 1.5;
    margin-bottom: 8px;

    ${mq.lg} {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      line-height: 1.6;
    }
  }

  ${CardMeta} {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;
