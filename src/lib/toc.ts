import GithubSlugger from "github-slugger";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const matches = Array.from(source.matchAll(regex));

  return matches
    .map((match) => {
      const level = match[1].length;
      let text = match[2].trim();

      // Strip markdown links [text](url) -> text
      text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      // Strip markdown formatting like **bold** or *italic* or `code`
      text = text.replace(/[*_`]/g, "");

      // Replicate the client-side "Go-To" logic
      if (text.toLowerCase().includes("go-to")) {
        text = "Project Resources";
      }

      const id = slugger.slug(text);

      return {
        id,
        text,
        level,
      };
    })
    .filter((h) => h.id && h.text);
}
