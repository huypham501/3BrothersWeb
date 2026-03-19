'use client';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Container } from '@/components/primitives/Container';
import { Button } from '@/components/ui/Button';
import { Row, Col } from '@/components/primitives/Grid';
import { ShowOnMobile, ShowOnDesktop } from '@/components/shared/Utilities';
import { mq } from '@/styles/mediaQueries';

export function Footer() {
  return (
    <FooterElement>
      <FooterTop>
        <Container>
          <Row>
            <Col $spanMd={7}>
              <AboutFooter>
                <ShowOnMobile>
                  <LogoFooter 
                    src="/metub/template/images/3brothers-logo-color.png" 
                    width="135" 
                    height="40" 
                    alt="Creators | 3BROTHERS Network | Leading Talent Network" 
                  />
                </ShowOnMobile>
                <p>Passionate. Creative. Insightful. Spark Joy!</p>
                <Row>
                  <Col $spanMd={5} style={{ padding: '24px 16px' }}>
                    <Button
                      as={Link}
                      href="/get-in-touch"
                      $variant="gradient"
                      $size="xl"
                      $rounded
                      style={{ textTransform: 'uppercase' }}
                    >
                      GET IN TOUCH
                    </Button>
                  </Col>
                  <Col $spanMd={7}>
                    <ContactInfo>
                      <p>For Creators: <a href="mailto:support@3brothers.net">support@3brothers.net</a></p>
                      <p>For Brand: <a href="mailto:booking@3brothers.net">booking@3brothers.net</a></p>
                    </ContactInfo>
                  </Col>
                </Row>
              </AboutFooter>
            </Col>
            
            <Col $spanMd={5} style={{ paddingLeft: '74px' }}>
              <ShowOnDesktop>
                <LogoFooter 
                  src="/metub/template/images/3brothers-logo-color.png" 
                  width={135} 
                  height={40} 
                  className="lazy" 
                  alt="Creators | 3BROTHERS Network | Leading Talent Network" 
                />
              </ShowOnDesktop>
              
              <FollowUs>
                <span>FOLLOW US</span>
                <a href="https://www.facebook.com/3brothers.net" target="_blank" rel="noreferrer">
                  <i className="ico-facebook"></i>
                </a>
                <a href="https://www.instagram.com/3brothersnetwork/?hl=vi" target="_blank" rel="noreferrer">
                  <i className="ico-instagram"></i>
                </a>
                <a href="https://www.youtube.com/user/3BrothersNetwork" target="_blank" rel="noreferrer">
                  <i className="ico-youtube"></i>
                </a>
              </FollowUs>
            </Col>
          </Row>
        </Container>
      </FooterTop>

      <FooterBottom>
        <Container>
          <p>
            <strong>HEAD QUARTER:</strong> 3BROTHERS Tower, 40 Nguyen Van Huong, Thao Dien Ward, Thu Duc City, HCM (
            <a 
              href="https://www.google.com/maps/dir/10.798111,106.73527/3BROTHERS+OFFICE,+Nguy%E1%BB%85n+V%C4%83n+H%C6%B0%E1%BB%9Fng,+Th%E1%BA%A3o+%C4%90i%E1%BB%81n,+Th%E1%BB%A7+%C4%90%E1%BB%A9c,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.8000664,106.7273221,16z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x317527a922b4dbff:0xd594a5033f660599!2m2!1d106.726304!2d10.804817" 
              rel="nofollow" 
              target="_blank"
              style={{ color: '#dd1a5d' }}
            >
              Google Map
            </a>)
          </p>
          <p>
            <strong>HOTLINE:</strong> <a href="tel:02835354245" rel="nofollow">0283 535 4245</a>
          </p>
          <p>
            <strong>HANOI:</strong> Bac Ha Tower, 219 Trung Kinh, Trung Hoa Ward, Cau Giay District, Ha Noi
          </p>
          <p>&copy; 2022. 3BROTHERS Vietnam Joint Stock Company.</p>
        </Container>
      </FooterBottom>
    </FooterElement>
  );
}

// ============================================
// Styled Components
// ============================================

const FooterElement = styled.footer`
  /* Footer styles */
`;

const FooterTop = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.xl};

  ${mq.md} {
    margin-bottom: 68px;
    padding-top: 68px;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 22px;
`;

const AboutFooter = styled.div`
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin: 16px 0 32px;
    line-height: 24px;
    max-width: 175px;

    ${mq.md} {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      margin: 12px 0 24px;
      line-height: 32px;
      max-width: none;
    }
  }
`;

const LogoFooter = styled(Image)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FollowUs = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 32px;

  a {
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    text-align: center;
    line-height: 34px;
    margin-left: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color ${({ theme }) => `${theme.motion.duration.fast} ${theme.motion.easing.easeInOut}`};

    ${mq.md} {
      margin-left: 10px;
    }

    ${mq.lg} {
      margin-left: 24px;
    }

    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};

      img,
      svg {
        filter: brightness(0) saturate(100%) invert(29%) sepia(84%) saturate(2953%)
          hue-rotate(323deg) brightness(85%) contrast(94%);
      }
    }
  }
`;

const ContactInfo = styled.div`
  padding: 24px 16px;
  
  p {
    margin-bottom: 8px;
    
    a {
      color: ${({ theme }) => theme.colors.white};
      text-decoration: none;
      
      &:hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;
