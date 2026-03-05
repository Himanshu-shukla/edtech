import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'EdTech Platform | Master New Skills & Accelerate Your Career',
  description: 'Join our premier learning platform to access top-tier courses, earn Microsoft certifications, and get mentored by industry experts. Start your journey today.',
  openGraph: {
    title: 'EdTech Platform | Master New Skills',
    description: 'Join our premier learning platform to access top-tier courses, earn Microsoft certifications, and get mentored by industry experts. Start your journey today.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EdTech Platform | Master New Skills',
    description: 'Join our premier learning platform to access top-tier courses, earn Microsoft certifications, and get mentored by industry experts. Start your journey today.',
  }
};

export default function Home() {
  return <HomePageClient />;
}
