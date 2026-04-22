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

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

interface Post extends PostMeta {
  content: string;
}

interface BlogData {
  posts: PostMeta[];
  postContents: Record<string, Post>;
}

const contentsDirectory = path.join(process.cwd(), "contents");
const outputPath = path.join(process.cwd(), "src/features/blog/data/blog-data.json");

/**
 * Rehype plugin to remove the first H1 element from the content.
 */
function rehypeRemoveFirstH1() {
  return (tree: Root) => {
    let removed = false;
    visit(tree, "element", (node, index, parent) => {
      if (!removed && node.tagName === "h1" && parent && typeof index === "number") {
        parent.children.splice(index, 1);
        removed = true;
        return index;
      }
      return undefined;
    });
  };
}

async function processMarkdown(content: string): Promise<string> {
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
  return processedContent.toString();
}

async function generateBlogData(): Promise<void> {
  console.log("Generating blog data...");

  const fileNames = fs.readdirSync(contentsDirectory);
  const mdFiles = fileNames.filter((fileName) => fileName.endsWith(".md"));

  const posts: PostMeta[] = [];
  const postContents: Record<string, Post> = {};

  for (const fileName of mdFiles) {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(contentsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const postMeta: PostMeta = {
      slug,
      title: data["title"] as string,
      date: data["date"] as string,
      description: data["description"] as string,
      tags: Array.isArray(data["tags"]) ? (data["tags"] as string[]) : [],
    };

    posts.push(postMeta);

    const contentHtml = await processMarkdown(content);
    postContents[slug] = {
      ...postMeta,
      content: contentHtml,
    };

    console.log(`  Processed: ${slug}`);
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  const blogData: BlogData = {
    posts,
    postContents,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(blogData, null, 2));
  console.log(`Blog data generated: ${outputPath}`);
}

generateBlogData().catch(console.error);
