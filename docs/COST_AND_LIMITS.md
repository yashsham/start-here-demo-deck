# Signal Stack — Free-Tier Limits & Unit Economics

## 1. Free-Tier Operational Limits

| Infrastructure Component | Free Quota Limit | Signal Stack Consumption (Per Company/Mo) | Capacity Margin |
| :--- | :--- | :--- | :--- |
| **Cloudflare Workers** | 100,000 requests/day | ~1,200 requests/day | **98.8% Headroom** |
| **Cloudflare Pages** | Unlimited bandwidth | ~5 GB / month | **Unlimited** |
| **Supabase PostgreSQL** | 500 MB database storage | ~35 MB (after 90 days of crawled data) | **93.0% Headroom** |
| **Groq Llama 3.3 70B** | 14,400 requests/day | ~60 requests/day (briefs + signals) | **99.5% Headroom** |
| **Tavily Search API** | 1,000 queries/month | ~80 queries/month (source discovery) | **92.0% Headroom** |

---

## 2. Unit Economics Per Monitored Enterprise

- **LLM Inference**: ~$0.08 per weekly brief synthesis (approx. 24,000 tokens on Groq Llama 3.3 70B).
- **Crawl & Vector Storage**: ~$0.02 per month for embeddings and snapshot archiving.
- **Total Variable Operating Cost**: **~$0.34 per company / month**.

Even at 50 monitored enterprises, total monthly cloud infrastructure expenses remain strictly within free-tier quotas ($0.00 cash expenditure).
