// app/layout.js

import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling
import '../app/global.css';
//import Header from '../components/Header';
//import MapHeader from '../components/MapHeader';
//import HeaderSizer from '../components/HeaderSizer';
import Find from '../components/Find';
import { LanguageProvider } from '../components/LanguageContext';

// Load the Inter font from Google Fonts with Latin subset
const inter = Inter({ subsets: ['latin'] });

// Metadata for the application
export const metadata = {
  title: 'GGC Maps', // Title of the application
  description: 'Campus map for Georgia Gwinnett College', // Description for SEO
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} app-layout`}>
        <LanguageProvider>
          <div className="standalone-search">
            <Find />
          </div>

          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
