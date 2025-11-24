export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mca-flowchart.vercel.app";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MCA Decision Making Pathway",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    description: "Professional decision-making tool for assessing mental capacity under the Mental Capacity Act (2005). Guide healthcare professionals, social workers, and legal practitioners through structured capacity assessments with step-by-step guidance.",
    url: baseUrl,
    author: {
      "@type": "Organization",
      name: "access: technology",
    },
    publisher: {
      "@type": "Organization",
      name: "access: technology",
    },
    inLanguage: "en-GB",
    featureList: [
      "Mental Capacity Act assessment guidance",
      "Step-by-step decision pathway",
      "Best interests evaluation",
      "Safeguarding considerations",
      "Professional healthcare tool",
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    releaseNotes: "Initial release of the MCA Decision Making Pathway tool",
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
    </>
  );
}

