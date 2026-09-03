import { getProjects, getBlogPosts } from "../src/lib/mdx";

async function runIntegrityChecks() {
  console.log("=== Content Integrity Checks ===\n");

  const projects = getProjects();
  const articles = getBlogPosts();

  const projectSlugs = new Set(projects.map(p => p.slug));
  const articleSlugs = new Set(articles.map(a => a.slug));

  const VALID_DOMAINS = new Set([
    "Systems", "AI", "Security", "IoT", "Web", "DevOps", 
    "Infrastructure", "Developer Tools", "Automation", "Data Engineering",
    "LegalTech", "Developer Tooling", "Mobile", "Hardware", "Sustainability"
  ]);

  const VALID_TECHNOLOGIES = new Set([
    "Rust", "Kotlin", "TypeScript", "Python", "Go", "C++", 
    "React", "Next.js", "Docker", "Kubernetes", "AWS", 
    "GCP", "PostgreSQL", "Redis", "C", "Java", "JavaScript",
    "Node.js", "Transformers", "Gradle", "Machine Learning", 
    "ESP32", "Firebase", "Supabase"
  ]);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`Assertion Failed: ${message}`);
      failed++;
    } else {
      passed++;
    }
  }

  console.log(`Checking ${projects.length} projects...`);
  for (const project of projects) {
    assert(!!project.title, `Project ${project.slug} must have a title`);
    assert(!!project.description, `Project ${project.slug} must have a description`);
    assert(!!project.domains && project.domains.length > 0, `Project ${project.slug} must have domains`);
    assert(!!project.technologies && project.technologies.length > 0, `Project ${project.slug} must have technologies`);

    if (project.domains) {
      for (const domain of project.domains) {
        assert(VALID_DOMAINS.has(domain), `Project ${project.slug} has unknown domain: ${domain}`);
      }
    }
    
    if (project.technologies) {
      for (const tech of project.technologies) {
        assert(VALID_TECHNOLOGIES.has(tech), `Project ${project.slug} has unknown technology: ${tech}`);
      }
    }

    assert(!!project.status, `Project ${project.slug} must have a status`);

    if (project.relatedProjects) {
      for (const rel of project.relatedProjects) {
        assert(projectSlugs.has(rel), `Project ${project.slug} has invalid related project: ${rel}`);
      }
    }
    if (project.relatedArticles) {
      for (const rel of project.relatedArticles) {
        assert(articleSlugs.has(rel), `Project ${project.slug} has invalid related article: ${rel}`);
      }
    }
  }

  console.log(`Checking ${articles.length} articles...`);
  for (const article of articles) {
    assert(!!article.title, `Article ${article.slug} must have a title`);
    assert(!!article.excerpt, `Article ${article.slug} must have an excerpt`);
    assert(!!article.topics && article.topics.length > 0, `Article ${article.slug} must have topics`);

    if (article.relatedProjects) {
      for (const rel of article.relatedProjects) {
        assert(projectSlugs.has(rel), `Article ${article.slug} has invalid related project: ${rel}`);
      }
    }
    if (article.relatedArticles) {
      for (const rel of article.relatedArticles) {
        assert(articleSlugs.has(rel), `Article ${article.slug} has invalid related article: ${rel}`);
      }
    }
  }

  console.log(`\n=== Test Results ===`);
  console.log(`Assertions Passed: ${passed}`);
  if (failed > 0) {
    console.log(`Assertions Failed: ${failed}`);
    process.exit(1);
  } else {
    console.log("All content integrity checks passed successfully! 🎉");
    process.exit(0);
  }
}

runIntegrityChecks();
