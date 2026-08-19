# Mackatak launch SEO checklist

The files currently use `https://www.mackatak.net` as the provisional preferred domain. Complete these items before the production launch.

## Confirm the source of truth

- [ ] Confirm whether the canonical host is `https://www.mackatak.net` or `https://mackatak.net`; redirect the other version to it with a permanent host-level redirect.
- [ ] Confirm the real service area and the locations Mackatak wants to target before adding geography to titles, copy, structured data or business listings.
- [ ] Provision and test the `connect@mackatak.net` brand alias currently used by the sample. If it will not be created, replace every link with a confirmed inbox before launch.
- [ ] Confirm the official business name, logo URL, telephone number, social profiles and any customer-facing address before publishing structured business data.

## Preserve the existing domain

- [ ] Export or crawl every current `mackatak.net` URL and map each valuable legacy page to the closest new equivalent.
- [ ] Review these expected mappings: `/mackatak-triathlon.html` → `/coaching.html` and `/mackatak-communications.html` → `/communications.html`.
- [ ] Decide individual destinations for `/about.html`, `/contact.html`, news/archive pages and person-specific pages. Keep useful pages when there is no close replacement; do not send every removed URL to the home page.
- [ ] Implement redirects as true HTTP `301` responses in the production host or CDN configuration—not JavaScript redirects or HTML refresh tags.
- [ ] Update important external profiles and links to point directly to the final URLs where practical.

## Connect search and measurement

- [ ] Verify the preferred domain in Google Search Console and Bing Webmaster Tools using real verification values supplied by those services.
- [ ] Submit `https://www.mackatak.net/sitemap.xml` after launch and monitor indexing, exclusions and crawl errors.
- [ ] Claim or update the Google Business Profile with the same confirmed business name, category, service area and contact details used on the site.
- [ ] Add the chosen analytics platform and record `Connect` clicks and outbound SmugMug archive clicks as conversion events. Do not publish placeholder IDs.
- [ ] Record a pre-launch baseline for indexed pages, branded queries and inbound enquiries so the impact can be measured.

## Validate production

- [ ] Confirm all six sitemap URLs return `200`, legacy mappings return `301`, and an unknown URL serves `404.html` with a real HTTP `404` status rather than `200`.
- [ ] Confirm HTTP, the non-preferred host and duplicate URL variants redirect in one hop to the preferred HTTPS canonical URL.
- [ ] Check that `robots.txt`, `sitemap.xml`, canonical URLs and structured data all use the final host consistently.
- [ ] Test mobile layouts, keyboard access, forms or email links, social previews, analytics events and Search Console URL inspection on the deployed site.
