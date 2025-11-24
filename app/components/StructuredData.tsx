import React from 'react';

export const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MCA Decision Making Pathway",
    "applicationCategory": "HealthcareApplication",
    "operatingSystem": "Any",
    "description": "Professional decision-making tool for assessing mental capacity under the Mental Capacity Act (2005).",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP"
    },
    "author": {
      "@type": "Organization",
      "name": "access: technology",
      "url": "https://accesstechnology.co.uk"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

