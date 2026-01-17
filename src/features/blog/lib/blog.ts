import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Root } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

// Re-export client-safe utilities for server components
export {
  getAllTags,
  getPostsByTags,
  type PostMeta,
  type SortOption,
  searchPosts,
  sortPosts,
} from "./blog-utils";

import type { PostMeta } from "./blog-utils";

const contentsDirectory = path.join(process.cwd(), "contents");

/**
 * Rehype plugin to remove the first H1 element from the content.
 * This prevents duplicate titles since the title is already displayed
 * via the page component using frontmatter data.
 */
function rehypeRemoveFirstH1() {
  return (tree: Root) => {
    let removed = false;
    visit(tree, "element", (node, index, parent) => {
      if (!removed && node.tagName === "h1" && parent && typeof index === "number") {
        parent.children.splice(index, 1);
        removed = true;
        return index; // Continue from the same index since we removed an element
      }
    });
  };
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
    .use(rehypeRemoveFirstH1)
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
