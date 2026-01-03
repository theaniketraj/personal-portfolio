export function seoGenerateMetaTags(page, site) {
    let pageMetaTags = {};

    if (site?.defaultMetaTags?.length) {
        site.defaultMetaTags.forEach((metaTag) => {
            pageMetaTags[metaTag.property] = metaTag.content;
        });
    }

    pageMetaTags = {
        ...pageMetaTags,
        ...(seoGenerateTitle(page, site) && { 'og:title': seoGenerateTitle(page, site) }),
        ...(seoGenerateOgImage(page, site) && { 'og:image': seoGenerateOgImage(page, site) })
    };

    if (page?.metaTags?.length) {
        page.metaTags.forEach((metaTag) => {
            pageMetaTags[metaTag.property] = metaTag.content;
        });
    }

    // Generate og:url if not present
    if (!pageMetaTags['og:url']) {
        const canonical = seoGenerateCanonical(page, site);
        if (canonical) {
            pageMetaTags['og:url'] = canonical;
        }
    }

    let metaTags = [];
    Object.keys(pageMetaTags).forEach((key) => {
        if (pageMetaTags[key] !== null) {
            metaTags.push({
                property: key,
                content: pageMetaTags[key],
                format: key.startsWith('og') || key.startsWith('twitter') ? 'property' : 'name'
            });
        }
    });

    return metaTags;
}

export function seoGenerateCanonical(page, site) {
    let domainUrl = site.env?.URL;
    if (!domainUrl && site.defaultMetaTags) {
        const ogUrlTag = site.defaultMetaTags.find((tag) => tag.property === 'og:url');
        if (ogUrlTag) {
            domainUrl = ogUrlTag.content;
        }
    }

    // fallback to known domain if available or return null
    if (!domainUrl) return null;

    // formatting
    domainUrl = domainUrl.replace(/\/$/, ''); // remove trailing slash

    let urlPath = '/';
    if (page.__metadata?.urlPath) {
        urlPath = page.__metadata.urlPath;
    } else if (page.slug) {
        urlPath = page.slug.startsWith('/') ? page.slug : '/' + page.slug;
    }

    // Ensure urlPath exists
    if (!urlPath) return domainUrl;

    return domainUrl + urlPath;
}

export function seoGenerateTitle(page, site) {
    let title = page?.metaTitle || page?.title || 'Personal Portfolio';
    if (site?.titleSuffix && page?.addTitleSuffix !== false) {
        title = `${title} - ${site.titleSuffix}`;
    }
    return title;
}

export function seoGenerateMetaDescription(page, site) {
    let metaDescription = null;
    // Blog posts use the excerpt as the default meta description
    // Add defensive check for __metadata
    if (page?.__metadata?.modelName === 'PostLayout') {
        metaDescription = page.excerpt;
    }
    // page metaDescription field overrides all others
    if (page?.metaDescription) {
        metaDescription = page.metaDescription;
    }
    return metaDescription;
}

export function seoGenerateOgImage(page, site) {
    let ogImage = null;
    // Use the sites default og:image field
    if (site?.defaultSocialImage) {
        ogImage = site.defaultSocialImage;
    }
    // Blog posts use the featuredImage as the default og:image
    // Add defensive check for __metadata
    if (page?.__metadata?.modelName === 'PostLayout') {
        if (page.featuredImage?.url) {
            ogImage = page.featuredImage.url;
        }
    }
    // page socialImage field overrides all others
    if (page?.socialImage) {
        ogImage = page.socialImage;
    }

    // Relative or absolute URL
    const absoluteUrlRegex = new RegExp('^(?:[a-z+]+:)?//', 'i');

    // ogImage should use an absolute URL. Get the Netlify domain URL from the Netlify environment variable process.env.URL
    const domainUrl = site.env?.URL;

    if (ogImage) {
        if (domainUrl && !absoluteUrlRegex.test(ogImage)) {
            return domainUrl + ogImage;
        } else {
            return ogImage;
        }
    }
    return null;
}
