# GitLab MR Searcher

1. Deploy to Cloudflare Workers
2. Set environment:
```
wrangler secret put GITLAB_BASE_URL # example value: https://gitlab.acme.corp
wrangler secret put GITLAB_TOKEN # example value: glpat-XXXXXXXXXX
```
3. Open `<your-worker-domain>/mr?search=PREFIX1-1111&search=PREFIX2-1111&notionId=PREFIX3-3333` to search GitLab MRs.

You can provide as many `search` arguments as you want (but at least one), and optionally provide `notionId` parameter to put `https://notion.so/<notionId>` link at the top and include this ID to search list.
