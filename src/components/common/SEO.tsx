import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import seoData from '../../data/seo.json';

interface SEOProps {
  pageKey: keyof typeof seoData;
}

/**
 * Updates page title and metadata tags dynamically on page load.
 */
export default function SEO({ pageKey }: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const pageSEO = seoData[pageKey] || seoData.home;
    document.title = pageSEO.title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageSEO.description);

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', pageSEO.keywords);
  }, [pageKey, location.pathname]);

  return null;
}
