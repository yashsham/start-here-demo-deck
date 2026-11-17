import type { ResearchDossier, BriefContent, PreviewSignal } from "../components/signal-stack/data";
import { langsmith } from "./langsmith.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY =
  (import.meta.env["VITE_GROQ_API_KEY"] as string | undefined) || "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";

export const GROQ_MODELS = {
  flagship: "openai/gpt-oss-120b",
  fast: "openai/gpt-oss-20b",
} as const;

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CallGroqOptions {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  jsonMode?: boolean;
  traceName?: string;
}

export async function callGroqChat({
  messages,
  model = GROQ_MODELS.flagship,
  temperature = 0.2,
  jsonMode = false,
  traceName = "GroqChatInference",
}: CallGroqOptions): Promise<string> {
  const startTime = Date.now();

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      void langsmith.traceRun({
        name: traceName,
        run_type: "llm",
        start_time: startTime,
        end_time: Date.now(),
        inputs: { model, messages, temperature, jsonMode },
        error: `HTTP ${response.status}: ${errorText}`,
      });
      throw new Error(`Groq API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    void langsmith.traceRun({
      name: traceName,
      run_type: "llm",
      start_time: startTime,
      end_time: Date.now(),
      inputs: { model, messages, temperature, jsonMode },
      outputs: { content, usage: data.usage },
      extra: { model, finish_reason: data.choices?.[0]?.finish_reason },
    });

    return content;
  } catch (err: any) {
    if (!err.message?.startsWith("Groq API Error")) {
      void langsmith.traceRun({
        name: traceName,
        run_type: "llm",
        start_time: startTime,
        end_time: Date.now(),
        inputs: { model, messages, temperature, jsonMode },
        error: err.message || "Unknown error during Groq invocation",
      });
    }
    throw err;
  }
}

/**
 * Autonomously synthesizes real company research dossier using Groq AI
 */
export async function synthesizeCompanyResearch(
  companyName: string,
  domain: string,
  industry?: string
): Promise<ResearchDossier> {
  const prompt = `You are a Principal Enterprise SaaS Research Analyst. Conduct a deep research dossier synthesis for the company: "${companyName}", domain: "${domain}"${
    industry ? `, operating in: "${industry}"` : ""
  }.
Output ONLY a valid JSON object matching this TypeScript structure:
{
  "company": "${companyName}",
  "overview": "Comprehensive 2-3 sentence corporate overview with strategic focus and market positioning.",
  "productsAndServices": [
    { "title": "Service or Product Name", "description": "Crisp 1-2 sentence description", "maturity": "Live" | "Pilot" | "Planned" }
  ],
  "businessModel": [
    { "stream": "Revenue Stream Name", "model": "Detailed delivery and pricing mechanism", "targetShare": "e.g. 50%" }
  ],
  "customerSegments": [
    { "name": "Target Audience / Segment", "profile": "Ideal customer profile and scale", "painPoint": "Primary operational friction point" }
  ],
  "positioning": [
    { "pillar": "Differentiating Strategic Pillar", "differentiator": "Why customers choose this over alternatives" }
  ],
  "factsVsAssumptions": [
    {
      "statement": "Clear factual or operational statement",
      "type": "Verified Fact" | "Operating Assumption" | "Public Stated Claim",
      "evidenceSource": "Source or verification rationale",
      "sourceUrl": "Canonical URL or domain",
      "confidence": number between 60 and 99
    }
  ]
}
Include exactly 3-4 products, 3 business model streams, 3 customer segments, 3 positioning pillars, and 5 facts vs assumptions.`;

  const content = await callGroqChat({
    messages: [
      { role: "system", content: "You are a senior equity and venture research intelligence agent. Return valid JSON only." },
      { role: "user", content: prompt },
    ],
    model: GROQ_MODELS.flagship,
    jsonMode: true,
    traceName: `CompanyResearchDossierAgent[${companyName}]`,
  });

  return JSON.parse(content) as ResearchDossier;
}

/**
 * Calibrates the 8 Intelligence Profile pillars from the founder's raw interview answers
 */
export async function calibrateProfileFromInterview(
  companyName: string,
  answers: Record<number, string>
): Promise<
  {
    id: string;
    label: string;
    summary: string;
    details: string;
    category: "Strategy" | "Monetization" | "Customers" | "Governance";
  }[]
> {
  const answerEntries = Object.entries(answers)
    .map(([qIdx, ans]) => `Question ${Number(qIdx) + 1}: ${ans}`)
    .join("\n\n");

  const prompt = `The founder of "${companyName}" answered the following discovery interview questions:
${answerEntries}

Based on these answers, calibrate the 8 foundational Intelligence Profile pillars.
Return ONLY a valid JSON object with a "pillars" array of exactly 8 items matching this schema:
{
  "pillars": [
    {
      "id": "business-model" | "revenue-streams" | "customer-segments" | "customer-problems" | "value-prop" | "competitors" | "growth-priorities" | "internal-context",
      "label": "Business Model" | "Revenue Streams" | "Customer Segments" | "Customer Problems & Friction" | "Value Proposition" | "Competitors & Substitutes" | "Growth Priorities (12 Months)" | "Internal Context & Governance",
      "summary": "Crisp 1-sentence executive summary headline",
      "details": "Detailed strategic context synthesizing the founder's answers",
      "category": "Monetization" | "Customers" | "Strategy" | "Governance"
    }
  ]
}`;

  const content = await callGroqChat({
    messages: [
      { role: "system", content: "You are an executive intelligence calibrator. Return valid JSON only." },
      { role: "user", content: prompt },
    ],
    model: GROQ_MODELS.flagship,
    jsonMode: true,
    traceName: `DynamicInterviewCalibrationAgent[${companyName}]`,
  });

  const parsed = JSON.parse(content);
  return parsed.pillars;
}

/**
 * Synthesizes a fresh Monday Morning Brief from active intelligence signals using Groq AI
 */
export async function generateMondayBriefWithAI(
  companyName: string,
  signals: PreviewSignal[]
): Promise<BriefContent[]> {
  const signalSummary = signals
    .map(
      (s) =>
        `- [${s.category}] (${s.type}, Urgency: ${s.urgency}) Event: "${s.event}". Why it matters: "${s.why}". Evidence: "${s.evidence}" (Source: ${s.source}). Action: "${s.recommendedAction}" (Owner: ${s.actionOwner}).`
    )
    .join("\n");

  const prompt = `You are the Editor-in-Chief of Signal Stack Executive Intelligence.
Synthesize the weekly Monday Morning Brief for "${companyName}" based on these verified signals:
${signalSummary}

You must return a valid JSON object with a "sections" array of exactly 10 sections in this order:
1. "Executive Summary"
2. "Customer Signals"
3. "Competitor Intelligence"
4. "Market Intelligence"
5. "Internal Business Intelligence"
6. "Opportunities Identified"
7. "Risks & Threats"
8. "Recommended Actions for This Week"
9. "What We Should Watch"
10. "Source Appendix"

Schema for each section:
{
  "sectionTitle": string (one of the 10 exact titles above),
  "headline": string (bold, news-style strategic headline),
  "summary": string (concise 2-3 sentence executive synthesis),
  "keyInsights": [ { "text": string, "citation": string } ],
  "actionItems": [ { "task": string, "owner": string, "priority": "P0" | "P1" | "P2", "status": false } ],
  "watchList": [ { "item": string, "threshold": string, "source": string } ]
}
Only include "actionItems" on "Recommended Actions for This Week" and "watchList" on "What We Should Watch".`;

  const content = await callGroqChat({
    messages: [
      { role: "system", content: "You are an executive briefing synthesis intelligence engine. Return valid JSON only." },
      { role: "user", content: prompt },
    ],
    model: GROQ_MODELS.flagship,
    jsonMode: true,
    traceName: `MondayMorningBriefSynthesisEngine[${companyName}]`,
  });

  const parsed = JSON.parse(content);
  return parsed.sections;
}

/**
 * Analyzes and classifies an ad-hoc signal event into an intelligence object
 */
export async function classifySignalEventWithAI(
  eventText: string,
  sourceUrl?: string
): Promise<{
  category: "Customers" | "Competitors" | "Market" | "Internal";
  type: "Opportunity" | "Threat" | "Neutral";
  urgency: "High" | "Medium" | "Low";
  why: string;
  businessArea: string;
  recommendedAction: string;
  actionOwner: string;
  relevanceScore: number;
}> {
  const prompt = `Analyze this corporate development / raw intelligence text:
"${eventText}"
${sourceUrl ? `Source URL: ${sourceUrl}` : ""}

Return a valid JSON object with:
{
  "category": "Customers" | "Competitors" | "Market" | "Internal",
  "type": "Opportunity" | "Threat" | "Neutral",
  "urgency": "High" | "Medium" | "Low",
  "why": "2-sentence strategic interpretation of why this matters to leadership",
  "businessArea": "Specific departmental area affected",
  "recommendedAction": "Actionable executive next step",
  "actionOwner": "Suggested executive title or owner",
  "relevanceScore": number between 70 and 99
}`;

  const content = await callGroqChat({
    messages: [
      { role: "system", content: "You are a rapid signal classifier. Return valid JSON only." },
      { role: "user", content: prompt },
    ],
    model: GROQ_MODELS.fast,
    jsonMode: true,
    traceName: "SignalClassifierInference",
  });

  return JSON.parse(content);
}
