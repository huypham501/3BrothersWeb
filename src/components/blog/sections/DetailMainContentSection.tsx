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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.5 12.0645C22.5 6.26602 17.7984 1.56445 12 1.56445C6.20156 1.56445 1.5 6.26602 1.5 12.0645C1.5 17.3051 5.33906 21.649 10.3594 22.4374V15.1005H7.69266V12.0645H10.3594V9.75117C10.3594 7.12008 11.9273 5.66555 14.3255 5.66555C15.4744 5.66555 16.6763 5.87086 16.6763 5.87086V8.45508H15.3516C14.048 8.45508 13.6402 9.26414 13.6402 10.0957V12.0645H16.552L16.087 15.1005H13.6406V22.4384C18.6609 21.6504 22.5 17.3065 22.5 12.0645Z"
        fill="#003CA6"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.25 5.13282C22.406 5.49955 21.513 5.74116 20.5992 5.85001C21.5595 5.28769 22.2817 4.39434 22.6303 3.33751C21.7224 3.86841 20.7307 4.24092 19.6978 4.43907C19.2629 3.98322 18.7397 3.62059 18.1603 3.3732C17.5808 3.12581 16.9571 2.99884 16.327 3.00001C13.7761 3.00001 11.7117 5.03438 11.7117 7.5422C11.7099 7.89102 11.7499 8.23881 11.8308 8.57813C10.0016 8.49238 8.2104 8.02575 6.57187 7.2081C4.93333 6.39044 3.48351 5.23977 2.31516 3.8297C1.90527 4.52069 1.6885 5.30909 1.6875 6.11251C1.6875 7.68751 2.50922 9.0797 3.75 9.89532C3.01487 9.87787 2.29481 9.68331 1.65094 9.32813V9.38438C1.65094 11.5875 3.24469 13.4203 5.35406 13.8375C4.9574 13.9432 4.54864 13.9968 4.13812 13.9969C3.84683 13.9974 3.5562 13.9691 3.27047 13.9125C3.85687 15.7172 5.56359 17.0297 7.58531 17.0672C5.94252 18.3333 3.9256 19.0175 1.85156 19.0125C1.48341 19.012 1.11561 18.99 0.75 18.9469C2.85993 20.2942 5.31255 21.0068 7.81594 21C16.3172 21 20.9616 14.0766 20.9616 8.07188C20.9616 7.87501 20.9564 7.67813 20.947 7.48595C21.8485 6.84472 22.6283 6.04787 23.25 5.13282Z"
        fill="#003CA6"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.3748 3.24984C17.5342 3.25331 18.6451 3.71539 19.4648 4.53517C20.2846 5.35495 20.7467 6.46582 20.7502 7.62516V16.3748C20.7467 17.5342 20.2846 18.6451 19.4648 19.4648C18.6451 20.2846 17.5342 20.7467 16.3748 20.7502H7.62516C6.46582 20.7467 5.35495 20.2846 4.53517 19.4648C3.71539 18.6451 3.25331 17.5342 3.24984 16.3748V7.62516C3.25331 6.46582 3.71539 5.35495 4.53517 4.53517C5.35495 3.71539 6.46582 3.25331 7.62516 3.24984H16.3748ZM16.3748 1.5H7.62516C4.25625 1.5 1.5 4.25625 1.5 7.62516V16.3748C1.5 19.7437 4.25625 22.5 7.62516 22.5H16.3748C19.7437 22.5 22.5 19.7437 22.5 16.3748V7.62516C22.5 4.25625 19.7437 1.5 16.3748 1.5Z"
        fill="#003CA6"
      />
      <path
        d="M17.6873 7.62516C17.4278 7.62516 17.174 7.54818 16.9582 7.40396C16.7423 7.25974 16.5741 7.05476 16.4748 6.81493C16.3754 6.5751 16.3494 6.3112 16.4001 6.0566C16.4507 5.802 16.5757 5.56814 16.7593 5.38458C16.9428 5.20102 17.1767 5.07602 17.4313 5.02538C17.6859 4.97473 17.9498 5.00072 18.1896 5.10006C18.4294 5.1994 18.6344 5.36763 18.7786 5.58347C18.9229 5.79931 18.9998 6.05307 18.9998 6.31266C19.0002 6.48512 18.9665 6.65596 18.9007 6.81537C18.8349 6.97477 18.7382 7.11961 18.6162 7.24156C18.4943 7.36351 18.3495 7.46018 18.1901 7.526C18.0306 7.59183 17.8598 7.62553 17.6873 7.62516Z"
        fill="#003CA6"
      />
      <path
        d="M12 8.49984C12.6923 8.49984 13.369 8.70512 13.9446 9.08973C14.5202 9.47433 14.9688 10.021 15.2337 10.6605C15.4986 11.3001 15.568 12.0039 15.4329 12.6828C15.2978 13.3618 14.9645 13.9855 14.475 14.475C13.9855 14.9645 13.3618 15.2978 12.6828 15.4329C12.0039 15.568 11.3001 15.4986 10.6605 15.2337C10.021 14.9688 9.47433 14.5202 9.08973 13.9446C8.70512 13.369 8.49984 12.6923 8.49984 12C8.50084 11.072 8.86992 10.1823 9.52611 9.52611C10.1823 8.86992 11.072 8.50084 12 8.49984ZM12 6.75C10.9616 6.75 9.94661 7.05791 9.08326 7.63478C8.2199 8.21166 7.54699 9.0316 7.14963 9.99091C6.75227 10.9502 6.6483 12.0058 6.85088 13.0242C7.05345 14.0426 7.55346 14.9781 8.28769 15.7123C9.02192 16.4465 9.95738 16.9466 10.9758 17.1491C11.9942 17.3517 13.0498 17.2477 14.0091 16.8504C14.9684 16.453 15.7883 15.7801 16.3652 14.9167C16.9421 14.0534 17.25 13.0384 17.25 12C17.25 10.6076 16.6969 9.27226 15.7123 8.28769C14.7277 7.30312 13.3924 6.75 12 6.75Z"
        fill="#003CA6"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.8441 6.97453C23.8441 4.86516 22.2926 3.16828 20.3754 3.16828C17.7785 3.04687 15.1301 3 12.4235 3H11.5798C8.87975 3 6.22663 3.04687 3.62975 3.16875C1.71725 3.16875 0.16569 4.875 0.16569 6.98437C0.0485028 8.65266 -0.00118468 10.3214 0.00162782 11.9902C-0.00305968 13.6589 0.0500653 15.3292 0.161003 17.0011C0.161003 19.1105 1.71257 20.8214 3.62507 20.8214C6.35319 20.948 9.15163 21.0042 11.9969 20.9995C14.8469 21.0089 17.6376 20.9495 20.3688 20.8214C22.286 20.8214 23.8376 19.1105 23.8376 17.0011C23.9501 15.3277 24.0016 13.6589 23.9969 11.9855C24.0076 10.3167 23.9566 8.64641 23.8441 6.97453ZM9.70475 16.5886V7.37766L16.5016 11.9808L9.70475 16.5886Z"
        fill="#003CA6"
      />
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
  font-family: ${typography.fontFamily.montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.primary};
  white-space: nowrap;
`;

/* Article H1 */
const ArticleTitle = styled.h1`
  font-family: ${typography.fontFamily.montserrat};
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
  font-family: ${typography.fontFamily.montserrat};
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
  font-family: ${typography.fontFamily.montserrat};
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
