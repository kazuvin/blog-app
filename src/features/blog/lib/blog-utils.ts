export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
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
