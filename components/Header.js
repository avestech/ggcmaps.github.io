// components/Header.js
"use client";
import { getAssetPath } from '../lib/assetUtils';
import Image from 'next/image';
import Find from "../components/Find";

export default function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-logo-link">
          <Image
            src={getAssetPath('/images/ggc-logo.png')}
            alt="GGC Logo"
            width={200}
            height={113}
            sizes="(max-width: 480px) 120px, (max-width: 768px) 160px, 200px"
            className="ggc-logo"
            priority
          />
        </div>
        <div className="header-search">
          <Find />
        </div>
        <div className="header-spacer"></div>
      </nav>
    </header>
  );
}

// Note: Logo Image is responsive via srcSet by default in Next.js Image
// Mobile breakpoints are handled via CSS media queries in global.css