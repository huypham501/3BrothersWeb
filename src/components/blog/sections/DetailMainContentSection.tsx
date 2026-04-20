'use client';

import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, borderRadius, motion } from '@/styles/tokens';

// ── Article data (placeholder — replace with real CMS/API data) ───────────────

const ARTICLE = {
  badge: 'Event • Sắp diễn ra',
  title: '2025 - Một năm tăng tốc Media trong hệ sinh thái Influence',
  date: 'August 20, 2022',
  heroImageBg: 'linear-gradient(135deg, #003CA6 0%, #1a56c4 50%, #0a3080 100%)',
  midImageBg: 'linear-gradient(160deg, #e8a020 0%, #c06010 100%)',
  sections: [
    {
      id: 'intro',
      heading: null,
      body: `Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime. However, traveling can also be stressful and overwhelming, especially if you don't plan and prepare adequately. In this blog article, we'll explore tips and tricks for a memorable journey and how to make the most of your travels.\n\nOne of the most rewarding aspects of traveling is immersing yourself in the local culture and customs. This includes trying local cuisine, attending cultural events and festivals, and interacting with locals. Learning a few phrases in the local language can also go a long way in making connections and showing respect.`,
    },
    {
      id: 'research',
      heading: 'Research Your Destination',
      body: `Before embarking on your journey, take the time to research your destination. This includes understanding the local culture, customs, and laws, as well as identifying top attractions, restaurants, and accommodations. Doing so will help you navigate your destination with confidence and avoid any cultural faux pas.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In hendrerit gravida rutrum quisque non tellus orci ac auctor. Mi ipsum faucibus vitae aliquet nec ullamcorper sit amet. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Viverra adipiscing at in tellus.`,
    },
    {
      id: 'itinerary',
      heading: 'Plan Your Itinerary',
      body: `While it's essential to leave room for spontaneity and unexpected adventures, having a rough itinerary can help you make the most of your time and budget. Identify the must-see sights and experiences and prioritize them according to your interests and preferences. This will help you avoid overscheduling and ensure that you have time to relax and enjoy your journey.\n\nVitae sapien pellentesque habitant morbi tristique. Luctus venenatis lectus magna fringilla. Nec ullamcorper sit amet risus nullam eget felis. Tincidunt arcu non sodales neque sodales ut etiam sit amet.`,
    },
  ],
  midSections: [
    {
      id: 'packing',
      heading: 'Pack Lightly and Smartly',
      body: `Packing can be a daunting task, but with some careful planning and smart choices, you can pack light and efficiently. Start by making a packing list and sticking to it, focusing on versatile and comfortable clothing that can be mixed and matched. Invest in quality luggage and packing organizers to maximize space and minimize wrinkles.`,
    },
    {
      id: 'health',
      heading: 'Stay Safe and Healthy',
      body: `Traveling can expose you to new environments and potential health risks, so it's crucial to take precautions to stay safe and healthy. This includes researching any required vaccinations or medications, staying hydrated, washing your hands frequently, and using sunscreen and insect repellent. It's also essential to keep your valuables safe and secure and to be aware of your surroundings at all times.`,
    },
    {
      id: 'culture',
      heading: 'Immerse Yourself in the Local Culture',
      body: `One of the most rewarding aspects of traveling is immersing yourself in the local culture and customs. This includes trying local cuisine, attending cultural events and festivals, and interacting with locals. Learning a few phrases in the local language can also go a long way in making connections and showing respect.`,
    },
    {
      id: 'memories',
      heading: 'Capture Memories',
      body: `Finally, don't forget to capture memories of your journey. Whether it's through photographs, journaling, or souvenirs, preserving the moments and experiences of your travels can bring joy and nostalgia for years to come. However, it's also essential to be present in the moment and not let technology distract you from the beauty of your surroundings.`,
    },
  ],
};

// ── Social share icons (inline SVGs) ─────────────────────────────────────────

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
        stroke="#003CA6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 4.01C21 4.5 20.02 4.69 19 5C17.879 3.735 16.217 3.665 14.62 4.263C13.023 4.861 11.977 6.323 12 8.01V9.01C8.755 9.083 5.865 7.605 4 5.01C4 5.01 -0.182 12.94 8 16.01C6.128 17.247 4.261 18.088 2 18.01C5.308 19.687 8.913 20.322 12 19.01C8.718 17.784 6.946 14.69 7.09 11.15C7.09 11.15 7.48 8.81 9.42 7.28C9.42 7.28 10.61 6.06 12.71 6.43C12.71 6.43 9.1 3.96 7.42 3.01C7.42 3.01 7.1 1.51 8.42 1.01C8.42 1.01 10.42 0.41 12 1.51C12 1.51 14 2.51 14 4.51C14 4.51 19 3.01 22 4.01Z"
        stroke="#003CA6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#003CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4" stroke="#003CA6" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="#003CA6" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988787 13.537 1.14277 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0112 9.96295 22.8573 8.1787 22.54 6.42Z"
        stroke="#003CA6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z" stroke="#003CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ArticleContentSection {
  id: string;
  heading: string | null;
  body: string;
}

export interface ArticleData {
  title: string;
  badge: string | null;
  date: string;
  heroImageBg: string;
  midImageBg?: string;
  sections: ArticleContentSection[];
  midSections: ArticleContentSection[];
}

// ── Component ────────────────────────────────────────────────────────────────

export function DetailMainContentSection({ article }: { article?: ArticleData }) {
  const data = article ?? ARTICLE;
  return (
    <SectionContainer>
      <InnerLayout>

        {/* ── Left social sidebar ── */}
        <SocialSidebar>
          <SocialButton href="#" aria-label="Share on Facebook">
            <FacebookIcon />
          </SocialButton>
          <SocialButton href="#" aria-label="Share on Twitter">
            <TwitterIcon />
          </SocialButton>
          <SocialButton href="#" aria-label="Share on Instagram">
            <InstagramIcon />
          </SocialButton>
          <SocialButton href="#" aria-label="Share on YouTube">
            <YoutubeIcon />
          </SocialButton>
        </SocialSidebar>

        {/* ── Article content ── */}
        <ArticleColumn>

          {/* Blog info header */}
          <BlogInfo>
            <ArticleHeading>
              {data.badge && (
                <Badge>
                  <BadgeText>{data.badge}</BadgeText>
                </Badge>
              )}
              <ArticleTitle>{data.title}</ArticleTitle>
            </ArticleHeading>
            <ArticleDate>{data.date}</ArticleDate>
          </BlogInfo>

          {/* Hero image */}
          <ArticleHeroImage $bg={data.heroImageBg} />

          {/* Intro paragraphs (no heading) */}
          {data.sections.map((section) => (
            <ArticleSection key={section.id}>
              {section.heading && (
                <SectionHeading>{section.heading}</SectionHeading>
              )}
              {section.body.split('\n\n').map((para, i) => (
                <ArticleParagraph key={i}>{para}</ArticleParagraph>
              ))}
            </ArticleSection>
          ))}

          {/* Mid-article image */}
          <ArticleMidImage $bg={data.midImageBg ?? ARTICLE.midImageBg} />

          {/* Remaining sections */}
          {data.midSections.map((section) => (
            <ArticleSection key={section.id}>
              {section.heading && (
                <SectionHeading>{section.heading}</SectionHeading>
              )}
              {section.body.split('\n\n').map((para, i) => (
                <ArticleParagraph key={i}>{para}</ArticleParagraph>
              ))}
            </ArticleSection>
          ))}

        </ArticleColumn>
      </InnerLayout>
    </SectionContainer>
  );
}

// ── Styled components ────────────────────────────────────────────────────────

const SectionContainer = styled.section`
  width: 100%;
  background: ${colors.white};
  padding: 80px 0 80px;

  ${mediaQueries.down.lg} {
    padding: 48px 0 60px;
  }
`;

/* The full-width inner wrapper that holds sidebar + content column */
const InnerLayout = styled.div`
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 84px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;

  ${mediaQueries.down.lg} {
    padding: 0 ${spacing.xl};
    flex-direction: column;
  }

  ${mediaQueries.down.sm} {
    padding: 0 ${spacing.lg};
  }
`;

/* ── Social sidebar ──────────────────────────────────────────────────────── */

const SocialSidebar = styled.div`
  position: sticky;
  top: 180px; /* stays visible as you scroll, below fixed header */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 48px;
  /* Push the article to the right — sidebar + gap = 48+188 = 236 matching design left:320 on 1440 canvas */
  flex-shrink: 0;
  margin-right: 188px;

  ${mediaQueries.down.lg} {
    position: static;
    flex-direction: row;
    margin-right: 0;
    margin-bottom: ${spacing.xl};
    width: auto;
  }
`;

const SocialButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  width: 48px;
  height: 48px;
  background: ${colors.white};
  box-shadow: 0px 16px 32px -4px rgba(12, 12, 13, 0.10),
              0px 4px 4px -4px rgba(12, 12, 13, 0.05);
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: transform ${motion.duration.base} ease,
              box-shadow ${motion.duration.base} ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 20px 40px -4px rgba(12, 12, 13, 0.15),
                0px 4px 8px -4px rgba(12, 12, 13, 0.08);
  }
`;

/* ── Article column ──────────────────────────────────────────────────────── */

const ArticleColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  flex: 1;
  min-width: 0;
  max-width: 800px;
`;

/* Blog Info block */
const BlogInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const ArticleHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

/* Yellow badge */
const Badge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  gap: 4px;
  background: ${colors.secondary}; /* #FFE773 */
  border-radius: 24px;
  flex-shrink: 0;
`;

const BadgeText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.primary};
  white-space: nowrap;
`;

/* Article H1 */
const ArticleTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize['6xl']}; /* 42px */
  line-height: 140%;
  color: #061530;
  margin: 0;
  width: 100%;

  ${mediaQueries.down.lg} {
    font-size: ${typography.fontSize['4xl']};
  }

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['2xl']};
  }
`;

/* Short info row (date) */
const ArticleDate = styled.time`
  font-family: 'Work Sans', 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 14px;
  line-height: 20px;
  color: #696A75;
  display: block;
`;

/* Hero image */
const ArticleHeroImage = styled.div<{ $bg: string }>`
  width: 100%;
  height: 462px;
  background: ${({ $bg }) => $bg};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  flex-shrink: 0;

  ${mediaQueries.down.lg} {
    height: 340px;
  }

  ${mediaQueries.down.sm} {
    height: 220px;
  }
`;

/* Mid-article image */
const ArticleMidImage = styled.div<{ $bg: string }>`
  width: 100%;
  height: 462px;
  background: ${({ $bg }) => $bg};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  flex-shrink: 0;

  ${mediaQueries.down.lg} {
    height: 340px;
  }

  ${mediaQueries.down.sm} {
    height: 220px;
  }
`;

/* Individual article body section (heading + paragraphs) */
const ArticleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

/* Blue section heading — h2 visually but inside h1 article */
const SectionHeading = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.primary}; /* #003CA6 */
  margin: 0;
  width: 100%;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize['2xl']};
  }
`;

/* Body paragraph */
const ArticleParagraph = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.lg}; /* 18px */
  line-height: 150%;
  color: #000000;
  margin: 0;
  width: 100%;

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.md};
  }
`;
