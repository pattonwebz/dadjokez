import { useEffect } from 'react';

const siteName = 'Dad Jokez';

/**
 * Keeps the document title in step with the current route.
 *
 * A client side route change leaves the title untouched by default, so screen
 * reader users get no confirmation that anything happened, and every browser
 * tab and history entry ends up with the same name.
 */
const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title ? `${title} - ${siteName}` : siteName;
    }, [title]);
};

export default usePageTitle;
