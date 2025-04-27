import { Helmet } from 'react-helmet-async';

export const Head = () => {
  return (
    <Helmet>
      <title>IQify - Train Your Brain with IQ Tests and Games</title>
      
      {/* Meta Description */}
      <meta name="description" content="IQify is your gateway to cognitive excellence. Train your brain with IQ tests, strategic games, and brain teasers. Join thousands of users improving their cognitive skills daily." />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://iqify.club" />
      <meta property="og:title" content="IQify - Train Your Brain with IQ Tests and Games" />
      <meta property="og:description" content="IQify is your gateway to cognitive excellence. Train your brain with IQ tests, strategic games, and brain teasers. Join thousands of users improving their cognitive skills daily." />
      <meta property="og:image" content="https://iqify.club/public/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://iqify.club" />
      <meta property="twitter:title" content="IQify - Train Your Brain with IQ Tests and Games" />
      <meta property="twitter:description" content="IQify is your gateway to cognitive excellence. Train your brain with IQ tests, strategic games, and brain teasers. Join thousands of users improving their cognitive skills daily." />
      <meta property="twitter:image" content="https://iqify.club/public/og-image.png" />
      <meta property="twitter:image:width" content="1200" />
      <meta property="twitter:image:height" content="630" />
    </Helmet>
  );
};
