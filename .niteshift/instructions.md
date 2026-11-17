If a change can be tested in a browser (for example a UI change), check it in the browser, take screenshots, and post the most relevant ones to the PR.

The dev stack runs Umami the way a scaled deployment does. Analytics are read from ClickHouse and tracked events go through Kafka. Postgres holds only users, websites, and reports. When you change an analytics query in `src/queries/sql/`, change its ClickHouse version too, because that is the one the app runs here. After changing analytics data in Postgres (for example with `/regen-hulu-data`), copy it into ClickHouse:

```bash
ns secrets exec --env DATABASE_URL=DATABASE_URL -- node .niteshift/files/sync-clickhouse.mjs
```

`DATABASE_URL` points at a hosted Postgres database that every task shares. Don't run migrations or destructive scripts against it unless the user asks.

## Scrolling in Umami

Umami's main content is a scrollable container, not the document body. `page.mouse.wheel()` and `window.scrollTo()` won't scroll it unless the mouse is first positioned over the content area (x > 300). To scroll it directly:

```js
await page.evaluate((scrollTop) => {
  const container = Array.from(document.querySelectorAll('*')).find(el => {
    const style = window.getComputedStyle(el);
    return (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
           el.scrollHeight > el.clientHeight;
  });
  if (container) container.scrollTop = scrollTop; // absolute; use += for relative
}, 500);
```
