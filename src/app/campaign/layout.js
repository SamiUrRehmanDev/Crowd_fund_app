import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function CampaignLayout({ children }) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
}
