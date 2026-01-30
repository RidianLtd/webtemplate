# Adding Collections

This guide walks through adding new content types to your site. We will use a blog as the example, but the process applies to any collection (portfolio, team members, products, etc.).

## Understanding Collections

Decap CMS supports two types of collections:

| Type | Best For | Example |
|------|----------|---------|
| **File-based** | Single items, settings, configuration | Homepage content, site settings |
| **Folder-based** | Multiple items of the same type | Blog posts, team members, products |

The template includes both types:
- `settings` and `homepage` are file-based (single JSON files)
- `pages` is folder-based (multiple markdown files)

## Adding a Blog Collection

### Step 1: Create Content Directory

```bash
mkdir src/content/blog
```

### Step 2: Configure CMS Collection

Edit `public/admin/config.yml` and add the new collection:

```yaml
collections:
  # ... existing collections ...

  # Blog Posts - folder-based, multiple markdown files
  - name: blog
    label: Blog Posts
    label_singular: Blog Post
    folder: src/content/blog
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    extension: md
    format: frontmatter
    sortable_fields: ['date', 'title']
    view_filters:
      - label: Published
        field: published
        pattern: true
      - label: Drafts
        field: published
        pattern: false
    fields:
      - name: title
        label: Title
        widget: string
        required: true

      - name: slug
        label: URL Slug
        widget: string
        pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', 'Lowercase letters, numbers, and hyphens only']
        required: true

      - name: date
        label: Publish Date
        widget: datetime
        required: true

      - name: description
        label: Description
        widget: text
        hint: "Short description for listings and SEO (max 160 characters)"
        required: true

      - name: image
        label: Featured Image
        widget: image
        required: false
        media_folder: /public/uploads/blog
        public_folder: /uploads/blog

      - name: published
        label: Published
        widget: boolean
        default: false

      - name: body
        label: Content
        widget: markdown
        required: true
```

### Step 3: Create Sample Post

Create `src/content/blog/2024-01-15-hello-world.md`:

```markdown
---
title: Hello World
slug: hello-world
date: 2024-01-15T10:00:00.000Z
description: Welcome to our blog! This is our first post.
image: /uploads/blog/hello-world.jpg
published: true
---

Welcome to our blog! We are excited to share updates and insights.

## What to Expect

We will be posting about:

- Product updates
- Industry insights
- Behind the scenes

Stay tuned for more!
```

### Step 4: Create Blog Listing Page

Create `src/pages/blog/index.astro`:

```astro
---
/**
 * Blog listing page
 * Displays all published blog posts
 */
import BaseLayout from '@/layouts/BaseLayout.astro'
import Header from '@/components/Header.astro'
import Footer from '@/components/Footer.astro'
import fs from 'node:fs'
import path from 'node:path'

// Read all blog posts
const blogDir = path.join(process.cwd(), 'src/content/blog')
let posts: Array<{
  slug: string
  title: string
  date: string
  description: string
  image?: string
  published: boolean
}> = []

if (fs.existsSync(blogDir)) {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

  posts = files
    .map(file => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8')
      const frontmatterRegex = /^---\n([\s\S]*?)\n---/
      const match = raw.match(frontmatterRegex)

      if (!match) return null

      const frontmatter: Record<string, string> = {}
      match[1].split('\n').forEach(line => {
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
          const key = line.slice(0, colonIndex).trim()
          const value = line.slice(colonIndex + 1).trim()
          frontmatter[key] = value
        }
      })

      return {
        slug: frontmatter.slug,
        title: frontmatter.title,
        date: frontmatter.date,
        description: frontmatter.description,
        image: frontmatter.image,
        published: frontmatter.published === 'true',
      }
    })
    .filter(post => post && post.published)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as typeof posts
}

// Read settings for page title
const settings = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/content/settings/general.json'), 'utf-8')
)
---

<BaseLayout title={`Blog | ${settings.site_title}`}>
  <Header />

  <main class="min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-text mb-4">Blog</h1>
        <p class="text-lg text-text-muted">
          Updates, insights, and behind the scenes
        </p>
      </header>

      {posts.length === 0 ? (
        <p class="text-center text-text-muted">No posts yet. Check back soon!</p>
      ) : (
        <div class="space-y-8">
          {posts.map(post => (
            <article class="bg-surface border border-border p-6 hover:border-primary transition-colors">
              <a href={`/blog/${post.slug}`} class="block">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    class="w-full h-48 object-cover mb-4"
                  />
                )}
                <time class="text-sm text-text-muted">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h2 class="text-2xl font-bold text-text mt-2 mb-3 hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p class="text-text-muted">{post.description}</p>
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  </main>

  <Footer />
</BaseLayout>
```

### Step 5: Create Blog Post Page

Create `src/pages/blog/[slug].astro`:

```astro
---
/**
 * Individual blog post page
 */
import BaseLayout from '@/layouts/BaseLayout.astro'
import Header from '@/components/Header.astro'
import Footer from '@/components/Footer.astro'
import { marked } from 'marked'
import fs from 'node:fs'
import path from 'node:path'

export async function getStaticPaths() {
  const blogDir = path.join(process.cwd(), 'src/content/blog')

  if (!fs.existsSync(blogDir)) {
    return []
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

  const posts = files
    .map(file => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8')
      const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
      const match = raw.match(frontmatterRegex)

      if (!match) return null

      const frontmatterStr = match[1]
      const content = match[2]

      const frontmatter: Record<string, string> = {}
      frontmatterStr.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
          const key = line.slice(0, colonIndex).trim()
          const value = line.slice(colonIndex + 1).trim()
          frontmatter[key] = value
        }
      })

      // Only include published posts
      if (frontmatter.published !== 'true') return null

      return {
        slug: frontmatter.slug,
        title: frontmatter.title,
        date: frontmatter.date,
        description: frontmatter.description,
        image: frontmatter.image,
        content: content,
      }
    })
    .filter(Boolean) as Array<{
      slug: string
      title: string
      date: string
      description: string
      image?: string
      content: string
    }>

  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }))
}

interface Props {
  slug: string
  title: string
  date: string
  description: string
  image?: string
  content: string
}

const post = Astro.props
const htmlContent = await marked(post.content)

// Format date for display
const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
---

<BaseLayout title={post.title} description={post.description}>
  <Header />

  <main class="min-h-screen px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
    <article class="max-w-3xl mx-auto">
      <!-- Post Header -->
      <header class="mb-10 text-center">
        <time class="text-text-muted">{formattedDate}</time>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-text mt-2 mb-4">
          {post.title}
        </h1>
        <p class="text-lg text-text-muted">{post.description}</p>
      </header>

      <!-- Featured Image -->
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          class="w-full h-auto mb-10"
        />
      )}

      <!-- Content -->
      <div class="prose-content p-6 sm:p-10 bg-surface border border-border">
        <Fragment set:html={htmlContent} />
      </div>

      <!-- Navigation -->
      <div class="mt-10 text-center">
        <a
          href="/blog"
          class="text-text-muted hover:text-primary transition-colors underline underline-offset-4"
        >
          &larr; Back to Blog
        </a>
      </div>
    </article>
  </main>

  <Footer />
</BaseLayout>

<style>
  /* Reuse prose styling from [...slug].astro */
  .prose-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .prose-content :global(h2:first-child) {
    margin-top: 0;
  }

  .prose-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .prose-content :global(p) {
    color: var(--color-text-muted);
    margin-bottom: 1rem;
    line-height: 1.75;
  }

  .prose-content :global(ul) {
    margin: 1rem 0;
    padding-left: 0;
  }

  .prose-content :global(li) {
    color: var(--color-text-muted);
    padding-left: 1.5rem;
    position: relative;
    list-style: none;
    margin-bottom: 0.5rem;
  }

  .prose-content :global(li)::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.625rem;
    height: 0.375rem;
    width: 0.375rem;
    border-radius: 50%;
    background-color: var(--color-primary);
  }

  .prose-content :global(strong) {
    font-weight: 600;
    color: var(--color-text);
  }

  .prose-content :global(a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .prose-content :global(blockquote) {
    border-left: 4px solid var(--color-primary);
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: var(--color-text-muted);
  }

  .prose-content :global(code) {
    background-color: var(--color-background);
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
    font-family: monospace;
    color: var(--color-primary);
  }

  .prose-content :global(pre) {
    background-color: var(--color-background);
    padding: 1rem;
    margin: 1rem 0;
    overflow-x: auto;
    border: 1px solid var(--color-border);
  }

  .prose-content :global(pre code) {
    background-color: transparent;
    padding: 0;
  }
</style>
```

### Step 6: Add Blog Link to Navigation

Edit `src/components/Header.astro` to include the blog link:

```astro
<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
  <a href="/about">About</a>
</nav>
```

### Step 7: Test

1. Run `npm run dev`
2. Visit `http://localhost:4321/blog` to see the listing
3. Click a post to view the detail page
4. Run `npx decap-server` and visit `/admin` to test CMS editing

## Other Collection Examples

### Team Members (Folder-based)

```yaml
- name: team
  label: Team Members
  folder: src/content/team
  create: true
  slug: "{{slug}}"
  fields:
    - { name: name, label: Name, widget: string }
    - { name: slug, label: URL Slug, widget: string }
    - { name: role, label: Role, widget: string }
    - { name: bio, label: Bio, widget: text }
    - { name: photo, label: Photo, widget: image }
    - { name: linkedin, label: LinkedIn URL, widget: string, required: false }
    - { name: order, label: Display Order, widget: number, default: 0 }
```

### FAQ (File-based)

```yaml
- name: faq
  label: FAQ
  files:
    - name: questions
      label: FAQ Questions
      file: src/content/faq/questions.json
      fields:
        - name: items
          label: Questions
          widget: list
          fields:
            - { name: question, label: Question, widget: string }
            - { name: answer, label: Answer, widget: markdown }
```

### Products (Folder-based with Categories)

```yaml
- name: products
  label: Products
  folder: src/content/products
  create: true
  fields:
    - { name: name, label: Product Name, widget: string }
    - { name: slug, label: URL Slug, widget: string }
    - { name: price, label: Price, widget: number, value_type: float }
    - { name: category, label: Category, widget: select,
        options: [Electronics, Clothing, Home, Other] }
    - { name: description, label: Description, widget: markdown }
    - { name: images, label: Images, widget: list, field: { widget: image } }
    - { name: featured, label: Featured, widget: boolean, default: false }
```

## Common Patterns

### Filtering Published Items

Always filter by `published` status in your templates:

```typescript
posts.filter(post => post.published)
```

### Sorting by Date

```typescript
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
```

### Sorting by Custom Order

```typescript
items.sort((a, b) => a.order - b.order)
```

### Limiting Items

```typescript
const recentPosts = posts.slice(0, 5)  // First 5
```

### Pagination

For larger collections, consider implementing pagination. This requires:

1. Multiple listing pages (`/blog/page/2`)
2. Computing total pages from item count
3. Previous/next navigation

This is beyond the scope of this basic guide but follows the same `getStaticPaths` pattern.

## Tips

1. **Start simple**: Add fields gradually as you need them
2. **Use validation**: Add patterns for slugs, required fields, etc.
3. **Test locally first**: Use `npx decap-server` before deploying
4. **Check the build**: Run `npm run build` to ensure all paths generate correctly
