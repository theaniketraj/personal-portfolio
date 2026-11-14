import { profileData, getSiteUrl } from './profile';
import { getProjectOgImage } from '@/lib/og';
import type { ProjectData, ProjectMeta, BlogPostMeta } from './types';

export type ProjectSchemaType = 'SoftwareApplication' | 'SoftwareSourceCode' | 'CreativeWork';

interface ProjectJsonLdParams {
    project: ProjectData;
    slug: string;
    relatedProjects: ProjectMeta[];
    relatedArticles: BlogPostMeta[];
}

export function getProjectSchemaType(project: ProjectData, slug: string): ProjectSchemaType {
    if (project.meta.schemaType) {
        return project.meta.schemaType;
    }

    const domains = project.meta.domains || [];
    const engineeringAreas = project.meta.engineeringAreas || [];

    if (
        domains.includes('Hardware') ||
        engineeringAreas.includes('Embedded Systems') ||
        domains.includes('IoT') ||
        slug === 'plastecure' ||
        slug === 'raptor'
    ) {
        return 'CreativeWork';
    }

    if (
        engineeringAreas.includes('Compiler Design') ||
        engineeringAreas.includes('Runtime Design') ||
        engineeringAreas.includes('Static Analysis') ||
        domains.includes('Developer Tools') ||
        domains.includes('Developer Tooling') ||
        slug === 'lexum' ||
        slug === 'project-karl' ||
        slug === 'scan'
    ) {
        return 'SoftwareSourceCode';
    }

    return 'SoftwareApplication';
}

const KNOWN_PROGRAMMING_LANGUAGES = new Set(['Kotlin', 'Rust', 'Python', 'TypeScript', 'Java', 'C']);

function getProjectDescription(meta: ProjectMeta): string {
    return meta.metaDescription || meta.description || meta.title;
}

function getProjectKeywords(meta: ProjectMeta): string[] {
    return meta.technologies || meta.tags || [];
}

function getApplicationCategory(meta: ProjectMeta): string {
    if (meta.applicationCategory) {
        return meta.applicationCategory;
    }
    if (meta.domains?.includes('LegalTech')) {
        return 'BusinessApplication';
    }
    return meta.domains?.[0] || 'DeveloperApplication';
}

function buildSoftwareApplicationProperties(meta: ProjectMeta): Record<string, unknown> {
    const properties: Record<string, unknown> = {
        applicationCategory: getApplicationCategory(meta)
    };
    if (meta.operatingSystem) {
        properties.operatingSystem = meta.operatingSystem;
    }
    return properties;
}

function getProgrammingLanguage(meta: ProjectMeta): string | undefined {
    if (meta.programmingLanguage) {
        return meta.programmingLanguage;
    }
    const detected = meta.technologies?.find((tech) => KNOWN_PROGRAMMING_LANGUAGES.has(tech));
    return detected || meta.technologies?.[0];
}

function buildSoftwareSourceCodeProperties(meta: ProjectMeta): Record<string, unknown> {
    const properties: Record<string, unknown> = {};
    const programmingLanguage = getProgrammingLanguage(meta);
    if (programmingLanguage) {
        properties.programmingLanguage = programmingLanguage;
    }
    if (meta.runtimePlatform) {
        properties.runtimePlatform = meta.runtimePlatform;
    }
    return properties;
}

function getCreativeWorkGenre(meta: ProjectMeta): string | undefined {
    if (meta.genre) {
        return meta.genre;
    }
    const isEmbeddedOrIoT = meta.engineeringAreas?.includes('Embedded Systems') || meta.domains?.includes('IoT');
    if (isEmbeddedOrIoT) {
        return 'Embedded IoT & Smart Hardware';
    }
    return undefined;
}

function buildCreativeWorkProperties(meta: ProjectMeta): Record<string, unknown> {
    const properties: Record<string, unknown> = {};
    const genre = getCreativeWorkGenre(meta);
    if (genre) {
        properties.genre = genre;
    }
    if (meta.about) {
        properties.about = meta.about;
    }
    return properties;
}

function getSchemaSpecificProperties(schemaType: ProjectSchemaType, meta: ProjectMeta): Record<string, unknown> {
    switch (schemaType) {
        case 'SoftwareApplication':
            return buildSoftwareApplicationProperties(meta);
        case 'SoftwareSourceCode':
            return buildSoftwareSourceCodeProperties(meta);
        case 'CreativeWork':
            return buildCreativeWorkProperties(meta);
        default:
            return {};
    }
}

export function createProjectJsonLd({
    project,
    slug,
    relatedProjects,
    relatedArticles
}: ProjectJsonLdParams): Record<string, unknown> {
    const schemaType = getProjectSchemaType(project, slug);

    return {
        '@context': 'https://schema.org',
        '@type': schemaType,
        '@id': getSiteUrl(`/projects/${slug}/#project`),
        name: project.meta.title,
        description: getProjectDescription(project.meta),
        author: {
            '@type': 'Person',
            '@id': `${profileData.url}/#person`,
            name: profileData.name,
            url: getSiteUrl('/')
        },
        publisher: {
            '@type': 'Person',
            '@id': `${profileData.url}/#person`,
            name: profileData.name
        },
        datePublished: project.meta.date,
        ...(project.meta.updatedAt ? { dateModified: project.meta.updatedAt } : {}),
        url: getSiteUrl(`/projects/${slug}`),
        keywords: getProjectKeywords(project.meta),
        image: getProjectOgImage(slug, project.meta.title).url,
        relatedLink: [
            ...relatedProjects.map((p) => getSiteUrl(`/projects/${p.slug}`)),
            ...relatedArticles.map((a) => getSiteUrl(`/blog/${a.slug}`))
        ],
        ...getSchemaSpecificProperties(schemaType, project.meta)
    };
}
