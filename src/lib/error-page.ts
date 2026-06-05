export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <title>CareerMirror AI — Something went wrong</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: dark;
        --bg: oklch(0.16 0.025 265);
        --fg: oklch(0.97 0.01 250);
        --muted: oklch(0.7 0.03 260);
        --card: oklch(0.21 0.03 265);
        --border: oklch(1 0 0 / 8%);
        --primary: oklch(0.78 0.19 145);
        --primary-fg: oklch(0.16 0.03 145);
      }
      body {
        font: 15px/1.5 "Inter", system-ui, -apple-system, sans-serif;
        background: var(--bg);
        color: var(--fg);
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
        background-image:
          radial-gradient(1200px 600px at 10% -10%, oklch(0.7 0.22 295 / 0.12), transparent 60%),
          radial-gradient(900px 500px at 110% 10%, oklch(0.78 0.19 145 / 0.1), transparent 60%);
      }
      .card {
        max-width: 28rem;
        width: 100%;
        text-align: center;
        padding: 2rem;
        background: color-mix(in oklab, var(--card) 70%, transparent);
        border: 1px solid var(--border);
        border-radius: 1rem;
        backdrop-filter: blur(14px);
      }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: var(--muted); margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font: inherit;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
      }
      .primary { background: var(--primary); color: var(--primary-fg); }
      .secondary { background: transparent; color: var(--fg); border-color: var(--border); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Something went wrong</h1>
      <p>We hit a snag loading this page. Try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
