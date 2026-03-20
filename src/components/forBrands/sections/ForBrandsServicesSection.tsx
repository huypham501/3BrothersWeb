'use client';

import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { mq } from "@/styles/mediaQueries";

const SERVICES = [
  {
    title: "Strategy",
    items: ["Content", "Influencer"],
  },
  {
    title: "Matchmaking",
    items: ["Management", "Production", "Content Creation"],
  },
  {
    title: "Distribution",
    items: ["Social Outreach", "Advertising"],
  },
  {
    title: "Consulting",
    items: ["Legal & Compliance", "Playbook", "Analytics"],
  },
] as const;

export function ForBrandsServicesSection() {
  return (
    <ServicesSection>
      <Container>
        <Heading>
          <HeadingTitle>
            OUR <span>SERVICES</span>
          </HeadingTitle>
        </Heading>

        <ServicesGrid>
          {SERVICES.map((service) => (
            <ServiceCard key={service.title}>
              <ServiceIcon aria-hidden="true" />
              <ServiceText>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceList>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ServiceList>
              </ServiceText>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
}


const ServicesSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]} 0;
  background-color: ${({ theme }) => theme.colors.white};

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["5xl"]} 0;
  }
`;

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

const HeadingTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  ${mq.md} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing["3xl"]};
  }
`;

const ServiceCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
`;

const ServiceIcon = styled.div`
  width: ${({ theme }) => theme.spacing["4xl"]};
  height: ${({ theme }) => theme.spacing["4xl"]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.bgLightAlt};
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: ${({ theme }) => theme.spacing.xs} solid transparent;
    border-bottom: ${({ theme }) => theme.spacing.xs} solid transparent;
    border-left: ${({ theme }) => theme.spacing.sm} solid ${({ theme }) => theme.colors.primary};
  }

  &::before {
    left: calc(50% - ${({ theme }) => theme.spacing.sm});
  }

  &::after {
    left: 50%;
  }
`;

const ServiceText = styled.div``;

const ServiceTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  li {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.textBody};
  }
`;
