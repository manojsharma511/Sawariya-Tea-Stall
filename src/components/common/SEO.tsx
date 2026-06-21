import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import seoData from '../../data/seo.json';

interface SEOProps {
  pageKey: keyof typeof seoData;
}

/**
 * Updates page title, metadata, OpenGraph, Twitter Cards, canonical links, and page-specific structured data (JSON-LD) dynamically.
 */
export default function SEO({ pageKey }: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const pageSEO = seoData[pageKey] || seoData.home;
    const currentUrl = `https://www.sawariyateastall.com${location.pathname}`;
    const defaultImage = 'https://www.sawariyateastall.com/sawariya-photos/cb5dc902-122f-49a9-a4f6-d03afe90cb10.png';

    // 1. Title Tag
    document.title = pageSEO.title;

    // 2. Helper to set meta tags
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Description & Keywords
    setMetaTag('name', 'description', pageSEO.description);
    setMetaTag('name', 'keywords', pageSEO.keywords);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', pageSEO.title);
    setMetaTag('property', 'og:description', pageSEO.description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', defaultImage);
    setMetaTag('property', 'og:type', 'website');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:title', pageSEO.title);
    setMetaTag('name', 'twitter:description', pageSEO.description);
    setMetaTag('name', 'twitter:image', defaultImage);
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // 6. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 7. Structured Data (JSON-LD)
    // Remove any previously added page-specific script tags to avoid duplication
    const oldScripts = document.querySelectorAll('script[data-seo-schema]');
    oldScripts.forEach(script => script.remove());

    const schemaJson: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": pageSEO.title,
      "description": pageSEO.description,
      "url": currentUrl,
      "publisher": {
        "@type": "LocalBusiness",
        "name": "Sawariya Tea Stall",
        "image": defaultImage,
        "telephone": "+917340030949",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Near Toran Gate",
          "addressLocality": "Khatu Shyam Ji",
          "addressRegion": "Rajasthan",
          "addressCountry": "IN",
          "postalCode": "332602"
        }
      }
    };

    // Add page-specific schema enhancements
    if (pageKey === 'menu') {
      schemaJson["@type"] = "MenuItem";
      schemaJson["offers"] = {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "10",
        "highPrice": "50",
        "offerCount": "15"
      };
    } else if (pageKey === 'testimonials') {
      schemaJson["aggregateRating"] = {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "120"
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-schema', 'true');
    script.text = JSON.stringify(schemaJson);
    document.head.appendChild(script);

  }, [pageKey, location.pathname]);

  return null;
}
