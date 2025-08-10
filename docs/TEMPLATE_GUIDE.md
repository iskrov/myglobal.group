# Website Improvement Guide (from Kotori.io Project)

This document outlines the key improvements and best practices applied to the `kotori.io` website. It's intended to be a guide for other teams working with the same "Web Hull" template to enhance their sites' content, design, SEO, and accessibility.

---

## 1. Content & Copywriting Strategy

The initial template content was generic. We transformed it to be empathetic, user-focused, and clear.

**Key Actions:**
- **Remove Generic/Unsubstantiated Claims:** Delete vague statements or metrics that aren't real (e.g., "trusted by 50k users," "24/7 support"). Be honest and authentic.
- **Focus on User Benefits, Not Technical Jargon:** Instead of describing the technology (e.g., "advanced transcription AI"), describe what it does for the user (e.g., "get clear summaries from your voice notes").
- **Empathy-Driven Language:** Address the user's specific pain points directly and gently. 
- **Inclusive & Accessible Copy:**
    - Avoid exclusionary or overly specific labels in primary marketing copy. We removed "parents" from main headlines to broaden the audience.
    - We used specific keywords like "ADHD," "autism," and "therapist" strategically in the FAQ section for SEO without alienating a general audience on the main page.
- **Concise & Scannable Text:** Refine headlines and body copy to be shorter and more impactful. This is crucial for users with attention deficits but benefits everyone.
- **Update the Footer:** Change the generic footer description to be a concise and accurate summary of your product.

## 2. SEO & Technical Enhancements

We implemented a foundational SEO strategy to ensure the site is discoverable and understood by search engines.

**Key Actions:**
- **Create `robots.txt`:** Add a `public/robots.txt` file to allow search engine crawlers and point them to your sitemap.
  ```
  User-agent: *
  Allow: /
  Sitemap: https://your-domain.com/sitemap.xml
  ```
- **Create `sitemap.xml`:** Add a `public/sitemap.xml` with the canonical URL of your site. Ensure it does not contain fragment URLs (like `/#features`).
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
     <loc>https://your-domain.com/</loc>
     <changefreq>weekly</changefreq>
     <priority>1.0</priority>
   </url>
  </urlset>
  ```
- **Optimize Page Titles & Meta Tags:**
    - Ensure `<title>` in `index.html` is unique and descriptive (50-60 characters).
    - Ensure `<meta name="description">` in `index.html` is compelling (150-160 characters).
    - **Crucially, remove em-dashes (`—`)** and replace them with standard hyphens (`-`) or colons (`:`) for better compatibility and rendering across platforms.
    - Update the `site.title` and `site.description` in `site-config.json` to match.
- **Semantic HTML & Accessibility:**
    - Use descriptive `alt` text for all images (`<img>` tags). This is critical for both SEO and accessibility.
    - Verify the site uses a logical heading structure (one `<h1>` per page, followed by `<h2>`, `<h3>`, etc.).
- **Update `README.md`:** Replace the generic template README with one specific to your project, explaining the structure, deployment process, and content management workflow.

## 3. Design, UX & Accessibility

We moved from a generic template look to a polished, low-stimulation design that reflects the brand's values.

**Key Actions:**
- **Consistent & Professional Icons:** Replace default emojis or basic icons with a high-quality, consistent icon set. We used **Lucide React**, which worked very well. Apply this to all sections, including Features.
- **Enhance Key Sections:**
    - **Hero Section:** Add a subtle, large-scale, low-opacity version of your logo in the background to reinforce branding without being distracting.
    - **Call-to-Action (CTA):** This is a critical section. Redesign it to be visually distinct and compelling. Use gradients, a clear button, and focused copy.
    - **FAQ Section:** Transform the plain list into an engaging, card-based component with hover effects and expand/collapse icons. This improves user experience and perceived quality.
- **Fix Dark Mode:** Thoroughly test the website in dark mode. We found and fixed numerous issues where text was unreadable or backgrounds were incorrect. Pay close attention to:
    - Main hero/section backgrounds.
    - Text colors (ensure they have `dark:` variants).
    - Gradient styles.
- **Solve Clickability Issues:** We found the CTA button was unclickable because of a decorative "glow" element overlapping it. Fix this by applying `z-index` to the button and `pointer-events-none` to the background effect.

## 4. Structural & Technical Fixes

- **Centralize Content in `site-config.json`:** Rely on `public/site-config.json` as the single source of truth for all copy. This allows for quick content updates without touching React components.
- **Remove/Hide Unused Sections:** If a section from the template is not relevant or you have no content for it, hide or remove it from `src/App.tsx` to avoid confusing users. We hid `ValueProposition` and `UseCases`.
- **GCP Deployment Permissions:** For Cloud Run deployments, the service needs to be publicly accessible. We fixed a "Forbidden" error by granting the `roles/run.invoker` role to `allUsers`. This is a common and critical step.

By following these steps, your team can significantly improve the quality, effectiveness, and maintainability of your website.
