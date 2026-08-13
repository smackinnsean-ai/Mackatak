# Mackatak Website Proposal

A standalone review build for the Mackatak Fitness and Communications website proposal. It uses static HTML, CSS, JavaScript, and local images, with no installation or build step.

## View the site

Open `index.html` directly in a browser, or serve the directory locally:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/>.

To review from another machine on a trusted local network, bind the temporary server to all interfaces:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Open `http://<server-ip>:8000/` from the other machine. Stop the temporary server when the review is complete.

## Pages

- `index.html`: landing page and service navigation
- `coaching.html`: coaching overview and client testimonial
- `photography.html`: photography overview and portfolio carousel
- `announcing.html`: announcing services, experience, and client testimonial
- `journalism.html`: journalism overview
- `communications.html`: communications overview

Shared styling is in `styles.css` and `service-pages.css`. Page-specific Announcing styles are in `announcing.css`. Carousel and Announcing interactions are in `carousel.js` and `announcing.js`.
