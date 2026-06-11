import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage the page title and meta description tag
 */
export const useDocumentTitle = (title: string, description?: string) => {
  useEffect(() => {
    document.title = `${title} | L'ESTATE`;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
};
