'use client';

import styled from 'styled-components';
import { colors } from '@/styles/tokens';

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';

import { FormSection } from './sections/FormSection';
import { ContactInfo } from './sections/ContactInfo';

interface ContactViewProps {
  header?: GlobalHeaderPayload | null;
  footer?: GlobalFooterPayload | null;
}

export function ContactView({ header, footer }: ContactViewProps) {
  return (
    <Wrapper>
      <Header content={header ?? undefined} />
      
      <MainContent>
        {/* Background blurs from the common CSS Contact tokens */}
        <BackgroundMesh>
          <Vector5 />
          <Vector7 />
          <Vector6 />
          <Vector8 />
          <Vector3 />
          <Vector9 />
        </BackgroundMesh>

        <FormSection />
        <ContactInfo />
      </MainContent>

      <Footer content={footer ?? undefined} />
    </Wrapper>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: #F4F8FF;
  box-shadow: 0px 4.5px 225px rgba(6, 21, 48, 0.6);
  overflow-x: hidden;
  font-family: 'Montserrat', 'Inter', sans-serif;
`;

const MainContent = styled.main`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/* Background Mesh specific to Contact page, shared between top and bottom sections partially */
const BackgroundMesh = styled.div`
  position: absolute;
  top: 120px;
  left: 0;
  right: 0;
  height: 800px;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  /* Simulates Mask Group */
`;

const Vector5 = styled.div`
  position: absolute;
  width: 900px;
  height: 1515px;
  left: -235px;
  top: -251px;
  background: #00328A;
  filter: blur(50px);
  transform: matrix(0.95, -0.32, 0.17, 0.99, 0, 0);
  opacity: 0.1; /* Toned down for light bg */
`;

const Vector7 = styled.div`
  position: absolute;
  width: 900px;
  height: 1162px;
  right: -200px;
  top: -200px;
  background: #003CA6;
  filter: blur(50px);
  transform: matrix(-0.97, 0.25, 0.22, 0.97, 0, 0);
  opacity: 0.1;
`;

const Vector6 = styled.div`
  position: absolute;
  width: 800px;
  height: 1123px;
  left: -201px;
  top: 81px;
  background: #003CA6;
  filter: blur(17.5px);
  transform: matrix(0.95, -0.32, 0.17, 0.99, 0, 0);
  opacity: 0.1;
`;

const Vector8 = styled.div`
  position: absolute;
  width: 800px;
  height: 861px;
  right: -200px;
  top: -54px;
  background: #6395ED;
  filter: blur(17.5px);
  transform: matrix(-0.97, 0.25, 0.22, 0.97, 0, 0);
  opacity: 0.1;
`;

const Vector3 = styled.div`
  position: absolute;
  width: 700px;
  height: 704px;
  left: -165px;
  top: 363px;
  background: #639CFF;
  filter: blur(32px);
  transform: matrix(0.95, -0.32, 0.17, 0.99, 0, 0);
  opacity: 0.1;
`;

const Vector9 = styled.div`
  position: absolute;
  width: 700px;
  height: 540px;
  right: -200px;
  top: 103px;
  background: #E0DED6;
  filter: blur(16px);
  transform: matrix(-0.97, 0.25, 0.22, 0.97, 0, 0);
  opacity: 0.5;
`;
