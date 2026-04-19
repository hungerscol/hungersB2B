import { useEffect } from 'react';

export const useSEO = ({ title, description }: { title: string; description: string }) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;

        const prevDescription = document.querySelector('meta[name="description"]');
        const metaDescription = prevDescription || document.createElement('meta');
        
        if (!prevDescription) {
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);

        return () => {
            document.title = prevTitle;
            if (prevDescription) {
                metaDescription.setAttribute('content', prevDescription.getAttribute('content') || '');
            } else {
                metaDescription.remove();
            }
        }
    }, [title, description]);
};
