import { ProjectMeta, BlogPostMeta } from './types';
import { profileData, Profile } from './profile';
import { getExperience } from './experience';

// A taxonomy alias map to normalize search terms and abbreviations
const TECHNOLOGY_ALIASES: Record<string, string> = {
    ts: 'typescript',
    typescript: 'typescript',
    js: 'javascript',
    javascript: 'javascript',
    k8s: 'kubernetes',
    kubernetes: 'kubernetes',
    reactjs: 'react',
    react: 'react',
    next: 'next.js',
    nextjs: 'next.js',
    'next.js': 'next.js',
    ml: 'machine learning',
    'machine learning': 'machine learning',
    ai: 'artificial intelligence',
    'artificial intelligence': 'artificial intelligence',
    postgres: 'postgresql',
    postgresql: 'postgresql',
    node: 'node.js',
    nodejs: 'node.js',
    'node.js': 'node.js',
    cpp: 'c++',
    'c++': 'c++'
};

export function normalizeTerm(term: string): string {
    const lower = term.toLowerCase().trim();
    if (TECHNOLOGY_ALIASES[lower]) {
        return TECHNOLOGY_ALIASES[lower];
    }
    return lower.replace(/\b([a-z0-9+#]+)\b/g, (match) => {
        return TECHNOLOGY_ALIASES[match] || match;
    });
}

export function normalizeSearchQuery(query: string): string[] {
    return query.toLowerCase().split(/\s+/).filter(Boolean).map(normalizeTerm);
}

export function matchesTerm(stored: string, queryToken: string, rawQueryToken?: string): boolean {
    const normStored = normalizeTerm(stored);
    const rawStored = stored.toLowerCase().trim();

    // 1. Exact match on normalized or raw
    if (normStored === queryToken || rawStored === queryToken) return true;
    if (rawQueryToken && (normStored === rawQueryToken || rawStored === rawQueryToken)) return true;

    // 2. Substring match on normalized terms or raw terms
    if (normStored.includes(queryToken) || queryToken.includes(normStored)) return true;
    if (rawStored.includes(queryToken)) return true;

    // 3. Match against raw query token if provided
    if (rawQueryToken) {
        if (rawQueryToken.length <= 2) {
            const wordRegex = new RegExp(`(^|[^a-z0-9])${rawQueryToken}([^a-z0-9]|$)`, 'i');
            if (wordRegex.test(rawStored)) return true;
        } else {
            if (rawStored.includes(rawQueryToken)) return true;
            if (normStored.includes(rawQueryToken)) return true;
        }
    }

    return false;
}

const mapToProjectSummary = (p: ProjectMeta) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    status: p.status,
    domains: p.domains,
    technologies: p.technologies,
    engineeringAreas: p.engineeringAreas,
    capabilities: p.capabilities,
    featured: p.featured
});

const mapToArticleSummary = (a: BlogPostMeta) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    topics: a.topics,
    tags: a.tags,
    contentType: a.contentType
});

const ROLE_ALIASES: Record<string, string[]> = {
    'backend engineer': ['backend', 'systems', 'api', 'infrastructure', 'database'],
    'backend developer': ['backend', 'systems', 'api', 'infrastructure', 'database'],
    'frontend engineer': ['frontend', 'react', 'ui', 'web'],
    'frontend developer': ['frontend', 'react', 'ui', 'web'],
    'fullstack engineer': ['backend', 'frontend', 'api', 'react', 'database', 'web'],
    'fullstack developer': ['backend', 'frontend', 'api', 'react', 'database', 'web'],
    'systems engineer': ['systems', 'distributed systems', 'infrastructure', 'rust', 'c++'],
    'ai engineer': ['ai', 'machine learning', 'ml', 'python', 'llm'],
    'machine learning engineer': ['ai', 'machine learning', 'ml', 'python', 'llm']
};

export const PortfolioService = {
    getProfile(
        projectsCount: number,
        articlesCount: number
    ): Profile & {
        experienceCount: number;
        projectCount: number;
        articleCount: number;
    } {
        return {
            ...profileData,
            experienceCount: getExperience().length,
            projectCount: projectsCount,
            articleCount: articlesCount
        };
    },

    searchProjects(
        projectsData: ProjectMeta[],
        params: {
            query?: string;
            domain?: string;
            technology?: string;
            capability?: string;
            status?: string;
            featuredOnly?: boolean;
            limit?: number;
            sort?: 'relevance' | 'date' | 'featured';
        }
    ) {
        let projects = params.featuredOnly ? projectsData.filter((p) => p.featured) : projectsData;

        // Default to active and completed projects unless explicitly asking for archived
        if (!params.status) {
            projects = projects.filter((p) => p && p.status !== 'archived');
        }

        if (params.domain) {
            const normalizedDomain = normalizeTerm(params.domain);
            projects = projects.filter((p) => p.domains?.some((d) => normalizeTerm(d) === normalizedDomain));
        }

        if (params.technology) {
            const normalizedTech = normalizeTerm(params.technology);
            projects = projects.filter((p) => p.technologies?.some((t) => normalizeTerm(t) === normalizedTech));
        }

        if (params.capability) {
            const normalizedCap = normalizeTerm(params.capability);
            projects = projects.filter((p) => p.capabilities?.some((c) => normalizeTerm(c) === normalizedCap));
        }

        if (params.status) {
            projects = projects.filter((p) => p.status === params.status);
        }

        let scoredProjects = projects.map((p) => ({ project: p, score: 0 }));

        if (params.query) {
            const rawTokens = params.query.toLowerCase().split(/\s+/).filter(Boolean);
            const tokens = rawTokens.map(normalizeTerm);
            scoredProjects.forEach((item) => {
                const p = item.project;
                let score = 0;

                for (let i = 0; i < tokens.length; i++) {
                    const q = tokens[i];
                    const rawQ = rawTokens[i];

                    if (matchesTerm(p.title, q, rawQ)) score += 10;
                    if (p.description && matchesTerm(p.description, q, rawQ)) score += 5;
                    if (p.domains?.some((d) => matchesTerm(d, q, rawQ))) score += 3;
                    if (p.technologies?.some((t) => matchesTerm(t, q, rawQ))) score += 3;
                    if (p.engineeringAreas?.some((e) => matchesTerm(e, q, rawQ))) score += 3;
                    if (p.capabilities?.some((c) => matchesTerm(c, q, rawQ))) score += 3;
                }
                item.score = score;
            });
            // Filter out zero score
            scoredProjects = scoredProjects.filter((item) => item.score > 0);
        }

        // Sorting
        const sortOrder = params.sort || 'relevance';
        scoredProjects.sort((a, b) => {
            // 1. Sort by specified order
            if (sortOrder === 'relevance' && params.query) {
                if (b.score !== a.score) return b.score - a.score;
            } else if (sortOrder === 'featured') {
                if (a.project.featured && !b.project.featured) return -1;
                if (!a.project.featured && b.project.featured) return 1;
            } else if (sortOrder === 'date') {
                const timeDiff = new Date(b.project.date).getTime() - new Date(a.project.date).getTime();
                if (timeDiff !== 0) return timeDiff;
            }

            // Tie Breakers: featured DESC -> date DESC -> slug ASC
            if (a.project.featured && !b.project.featured) return -1;
            if (!a.project.featured && b.project.featured) return 1;

            const dateDiff = new Date(b.project.date).getTime() - new Date(a.project.date).getTime();
            if (dateDiff !== 0) return dateDiff;

            return a.project.slug.localeCompare(b.project.slug);
        });

        const finalProjects = scoredProjects.map((item) => mapToProjectSummary(item.project));
        return finalProjects.slice(0, Math.min(params.limit || 5, 10));
    },

    getProjectSummary(projectsData: ProjectMeta[], articlesData: BlogPostMeta[], slug: string) {
        const meta = projectsData.find((p) => p.slug === slug);
        if (!meta) return null;

        const relatedProjects = meta.relatedProjects?.flatMap((pSlug) => {
            const p = projectsData.find((pData) => pData.slug === pSlug);
            return p ? [{ slug: p.slug, title: p.title, description: p.description }] : [];
        });

        const relatedArticles = meta.relatedArticles?.flatMap((aSlug) => {
            const a = articlesData.find((aData) => aData.slug === aSlug);
            return a ? [{ slug: a.slug, title: a.title, excerpt: a.excerpt }] : [];
        });

        return {
            ...mapToProjectSummary(meta),
            relatedProjectsDetails: (relatedProjects || []).slice(0, 10),
            relatedArticlesDetails: (relatedArticles || []).slice(0, 10)
        };
    },

    searchArticles(
        articlesData: BlogPostMeta[],
        params: {
            query?: string;
            topic?: string;
            tags?: string;
            contentType?: string;
            limit?: number;
            sort?: 'relevance' | 'date';
        }
    ) {
        let articles = articlesData;

        if (params.topic) {
            const normalizedTopic = normalizeTerm(params.topic);
            articles = articles.filter((a) => a.topics?.some((t) => normalizeTerm(t) === normalizedTopic));
        }

        if (params.tags) {
            const normalizedTag = normalizeTerm(params.tags);
            articles = articles.filter((a) => a.tags?.some((t) => normalizeTerm(t) === normalizedTag));
        }

        if (params.contentType) {
            const normalizedType = normalizeTerm(params.contentType);
            articles = articles.filter((a) => a.contentType?.some((t) => normalizeTerm(t) === normalizedType));
        }

        let scoredArticles = articles.map((a) => ({ article: a, score: 0 }));

        if (params.query) {
            const rawTokens = params.query.toLowerCase().split(/\s+/).filter(Boolean);
            const tokens = rawTokens.map(normalizeTerm);
            scoredArticles.forEach((item) => {
                const a = item.article;
                let score = 0;

                for (let i = 0; i < tokens.length; i++) {
                    const q = tokens[i];
                    const rawQ = rawTokens[i];

                    if (matchesTerm(a.title, q, rawQ)) score += 10;
                    if (a.excerpt && matchesTerm(a.excerpt, q, rawQ)) score += 5;
                    if (a.topics?.some((t) => matchesTerm(t, q, rawQ))) score += 3;
                    if (a.tags?.some((t) => matchesTerm(t, q, rawQ))) score += 3;
                }
                item.score = score;
            });
            // Filter out zero score
            scoredArticles = scoredArticles.filter((item) => item.score > 0);
        }

        // Sorting
        const sortOrder = params.sort || 'relevance';
        scoredArticles.sort((a, b) => {
            // 1. Sort by specified order
            if (sortOrder === 'relevance' && params.query) {
                if (b.score !== a.score) return b.score - a.score;
            } else if (sortOrder === 'date') {
                const timeDiff = new Date(b.article.date).getTime() - new Date(a.article.date).getTime();
                if (timeDiff !== 0) return timeDiff;
            }

            // Tie Breakers: date DESC -> slug ASC
            const dateDiff = new Date(b.article.date).getTime() - new Date(a.article.date).getTime();
            if (dateDiff !== 0) return dateDiff;

            return a.article.slug.localeCompare(b.article.slug);
        });

        const finalArticles = scoredArticles.map((item) => mapToArticleSummary(item.article));
        return finalArticles.slice(0, Math.min(params.limit || 5, 10));
    },

    getArticleSummary(projectsData: ProjectMeta[], articlesData: BlogPostMeta[], slug: string) {
        const meta = articlesData.find((a) => a.slug === slug);
        if (!meta) return null;

        const relatedProjects = meta.relatedProjects?.flatMap((pSlug) => {
            const p = projectsData.find((pData) => pData.slug === pSlug);
            return p ? [{ slug: p.slug, title: p.title, description: p.description }] : [];
        });

        const relatedArticles = meta.relatedArticles?.flatMap((aSlug) => {
            const a = articlesData.find((aData) => aData.slug === aSlug);
            return a ? [{ slug: a.slug, title: a.title, excerpt: a.excerpt }] : [];
        });

        return {
            ...mapToArticleSummary(meta),
            relatedProjectsDetails: (relatedProjects || []).slice(0, 10),
            relatedArticlesDetails: (relatedArticles || []).slice(0, 10)
        };
    },

    findRelevantWork(
        projectsData: ProjectMeta[],
        articlesData: BlogPostMeta[],
        params: {
            role?: string;
            skills?: string[];
            domains?: string[];
            keywords?: string[];
            limit?: number;
            includeArchived?: boolean;
        }
    ) {
        const activeProjectsData = params.includeArchived
            ? projectsData
            : projectsData.filter((p) => p.status !== 'archived');

        // Score based matching
        const keywords = (params.keywords || []).map(normalizeTerm);
        const skills = (params.skills || []).map(normalizeTerm);
        const domains = (params.domains || []).map(normalizeTerm);
        const roleTerms: string[] = [];
        if (params.role) {
            const normalizedRole = normalizeTerm(params.role);
            roleTerms.push(normalizedRole);
            if (ROLE_ALIASES[normalizedRole]) {
                roleTerms.push(...ROLE_ALIASES[normalizedRole]);
            }
        }

        const allSearchTerms = [...keywords, ...skills, ...domains, ...roleTerms];

        if (allSearchTerms.length === 0) {
            // If no search terms, just return the most recent/featured items
            const sortedProjects = [...activeProjectsData]
                .sort((a, b) => {
                    if (b.featured !== a.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                })
                .slice(0, Math.min(params.limit || 3, 10))
                .map((p) => ({
                    project: mapToProjectSummary(p),
                    score: 0,
                    matches: [],
                    reason: 'Recent project.'
                }));

            const sortedArticles = [...articlesData]
                .sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                })
                .slice(0, Math.min(params.limit || 3, 10))
                .map((a) => ({
                    article: mapToArticleSummary(a),
                    score: 0,
                    matches: [],
                    reason: 'Recent article.'
                }));

            return { projects: sortedProjects, articles: sortedArticles };
        }

        const checkMatch = (term: string, fieldTerms: string[]) => {
            return fieldTerms.some((ft) => ft.includes(term) || term.includes(ft));
        };

        const scoreProject = (p: ProjectMeta) => {
            let score = 0;
            const matched: string[] = [];
            const titleTerms = [normalizeTerm(p.title)];
            const pTechs = (p.technologies || []).map(normalizeTerm);
            const pEngAreas = (p.engineeringAreas || []).map(normalizeTerm);
            const pDomains = (p.domains || []).map(normalizeTerm);
            const pCapabilities = (p.capabilities || []).map(normalizeTerm);

            for (const term of allSearchTerms) {
                if (checkMatch(term, pTechs)) {
                    score += 5;
                    matched.push(term);
                } else if (checkMatch(term, pEngAreas)) {
                    score += 4;
                    matched.push(term);
                } else if (checkMatch(term, pDomains)) {
                    score += 3;
                    matched.push(term);
                } else if (checkMatch(term, pCapabilities)) {
                    score += 3;
                    matched.push(term);
                } else if (checkMatch(term, titleTerms)) {
                    score += 2;
                    matched.push(term);
                } else if (p.description && normalizeTerm(p.description).includes(term)) {
                    score += 1;
                    matched.push(term);
                }
            }
            return { score, matched: [...new Set(matched)] };
        };

        const scoreArticle = (a: BlogPostMeta) => {
            let score = 0;
            const matched: string[] = [];
            const titleTerms = [normalizeTerm(a.title)];
            const aTopics = (a.topics || []).map(normalizeTerm);
            const aTags = (a.tags || []).map(normalizeTerm);

            for (const term of allSearchTerms) {
                if (checkMatch(term, aTopics)) {
                    score += 4;
                    matched.push(term);
                } else if (checkMatch(term, aTags)) {
                    score += 3;
                    matched.push(term);
                } else if (checkMatch(term, titleTerms)) {
                    score += 2;
                    matched.push(term);
                } else if (a.excerpt && normalizeTerm(a.excerpt).includes(term)) {
                    score += 1;
                    matched.push(term);
                }
            }
            return { score, matched: [...new Set(matched)] };
        };

        const scoredProjects = activeProjectsData
            .map((p) => {
                const { score, matched } = scoreProject(p);
                const reason =
                    matched.length > 0 ? `Matched based on: ${matched.join(', ')}.` : 'Relevant to your query.';
                return { project: p, mappedProject: mapToProjectSummary(p), score, matches: matched, reason };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                if (b.project.featured !== a.project.featured)
                    return (b.project.featured ? 1 : 0) - (a.project.featured ? 1 : 0);
                const dateB = new Date(b.project.date).getTime();
                const dateA = new Date(a.project.date).getTime();
                if (dateB !== dateA) return dateB - dateA;
                return a.project.slug.localeCompare(b.project.slug);
            })
            .slice(0, Math.min(params.limit || 3, 10))
            .map((item) => ({
                project: item.mappedProject,
                score: item.score,
                matches: item.matches,
                reason: item.reason
            }));

        const scoredArticles = articlesData
            .map((a) => {
                const { score, matched } = scoreArticle(a);
                const reason =
                    matched.length > 0 ? `Matched based on: ${matched.join(', ')}.` : 'Relevant to your query.';
                return { article: a, mappedArticle: mapToArticleSummary(a), score, matches: matched, reason };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                const dateB = new Date(b.article.date).getTime();
                const dateA = new Date(a.article.date).getTime();
                if (dateB !== dateA) return dateB - dateA;
                return a.article.slug.localeCompare(b.article.slug);
            })
            .slice(0, Math.min(params.limit || 3, 10))
            .map((item) => ({
                article: item.mappedArticle,
                score: item.score,
                matches: item.matches,
                reason: item.reason
            }));

        return {
            projects: scoredProjects,
            articles: scoredArticles
        };
    }
};
