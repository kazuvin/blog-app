import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const contentsDirectory = path.join(process.cwd(), "contents");

export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface Post extends PostMeta {
  content: string;
}

export function getSortedPostsData(): PostMeta[] {
  const fileNames = fs.readdirSync(contentsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(contentsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(contentsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(contentsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    content: contentHtml,
  };
}

export function getAllTags(posts: PostMeta[]): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export function getPostsByTag(posts: PostMeta[], tag: string | null | undefined): PostMeta[] {
  if (tag === null || tag === undefined) {
    return posts;
  }
  return posts.filter((post) => post.tags.includes(tag));
}

export function sortPosts(posts: PostMeta[], sortOption: SortOption): PostMeta[] {
  const sorted = [...posts];

  switch (sortOption) {
    case "date-asc":
      return sorted.sort((a, b) => (a.date > b.date ? 1 : -1));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted.sort((a, b) => (a.date < b.date ? 1 : -1));
  }
}

export function searchPosts(posts: PostMeta[], query: string): PostMeta[] {
  const trimmedQuery = query.trim().toLowerCase();

  if (trimmedQuery === "") {
    return posts;
  }

  return posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(trimmedQuery);
    const descriptionMatch = post.description.toLowerCase().includes(trimmedQuery);
    const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(trimmedQuery));

    return titleMatch || descriptionMatch || tagsMatch;
  });
}
