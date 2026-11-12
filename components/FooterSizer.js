// 'use client';

// import { useEffect } from 'react';

// /**
//  * FooterSizer measures the fixed footer ('.footer') and updates
//  * the CSS variable --footer-height so map viewers leave space
//  * for the footer on all screen sizes (especially mobile).
//  */
// export default function FooterSizer() {
//   useEffect(() => {
//     const setFooterHeight = () => {
//       const footer = document.querySelector('.footer');
//       if (footer) {
//         const height = footer.offsetHeight;
//         document.documentElement.style.setProperty('--footer-height', `${height}px`);
//       }
//     };

//     // Initial measure
//     setFooterHeight();

//     // Update on resize/orientation change
//     window.addEventListener('resize', setFooterHeight);

//     // Observe footer size changes
//     const footer = document.querySelector('.footer');
//     let observer;
//     if (footer && typeof ResizeObserver !== 'undefined') {
//       observer = new ResizeObserver(setFooterHeight);
//       observer.observe(footer);
//     }

//     return () => {
//       window.removeEventListener('resize', setFooterHeight);
//       if (observer) observer.disconnect();
//     };
//   }, []);

//   return null;
// }
