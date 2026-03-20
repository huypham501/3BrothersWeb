import { Metadata } from 'next';
import { HomeViewV2 } from '@/components/home-v2/HomeViewV2';

export const metadata: Metadata = {
  title: "3BROTHERS NETWORK | Home V2",
  description: "The Leading Creator Economy Platform - V2",
};

export default function HomeV2Page() {
  return <HomeViewV2 />;
}
