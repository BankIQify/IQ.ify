import { useEffect } from 'react';

export const Favicon = () => {
  useEffect(() => {
    // Remove any existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());

    // Create favicon links for different sizes and formats
    const faviconLinks = [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: 'apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: 'android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: 'android-chrome-512x512.png' },
      { rel: 'manifest', href: 'manifest.json' },
      { rel: 'mask-icon', href: 'safari-pinned-tab.svg', color: '#5bbad5' }
    ];

    // Add all favicon links
    faviconLinks.forEach(linkData => {
      const link = document.createElement('link');
      Object.entries(linkData).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    });
  }, []);

  return null;
}; 