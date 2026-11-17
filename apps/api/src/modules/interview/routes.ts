import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";
import { NotFoundError } from "../../core/errors.js";

const AnswerSchema = z.object({
  answerText: z.string().min(1),
  questionId: z.string().min(1),
});

interface InterviewState {
  id: string;
  companyId: string;
  status: "in_progress" | "calibrated";
  questions: Array<{ id: string; text: string; category: string; answered: boolean }>;
  answers: Array<{ id: string; questionId: string; answerText: string; timestamp: string }>;
}

const interviewStore = new Map<string, InterviewState>();

export const interviewRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

interviewRoutes.post("/:id/interview/start", async (c) => {
  const companyId = c.req.param("id");
  const id = "int_" + crypto.randomUUID();
  const session: InterviewState = {
    id,
    companyId,
    status: "in_progress",
    questions: [
      { id: "q1", text: "What are your highest priority strategic threats over the next 180 days?", category: "strategic_moves", answered: false },
      { id: "q2", text: "Which regulatory or antitrust frameworks pose the greatest compliance friction?", category: "regulatory_compliance", answered: false },
      { id: "q3", text: "Which competitor moves require immediate executive escalation?", category: "market_competitors", answered: false },
    ],
    answers: [],
  };
  interviewStore.set(id, session);
  return c.json({ success: true, data: session }, 201);
});

interviewRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const session = interviewStore.get(id);
  if (!session) throw new NotFoundError("Interview session", id);
  return c.json({ success: true, data: session });
});

interviewRoutes.post("/:id/answer", zValidator("json", AnswerSchema), async (c) => {
  const id = c.req.param("id");
  const session = interviewStore.get(id);
  if (!session) throw new NotFoundError("Interview session", id);
  const { answerText, questionId } = c.req.valid("json");
  const answerId = "ans_" + crypto.randomUUID();
  session.answers.push({
    id: answerId,
    questionId,
    answerText,
    timestamp: new Date().toISOString(),
  });
  const q = session.questions.find((x) => x.id === questionId);
  if (q) q.answered = true;
  return c.json({ success: true, data: { answerId, session } });
});

interviewRoutes.post("/:id/skip", async (c) => {
  const id = c.req.param("id");
  const session = interviewStore.get(id);
  if (!session) throw new NotFoundError("Interview session", id);
  return c.json({ success: true, message: "Question skipped" });
});

interviewRoutes.patch("/:id/answers/:answerId", zValidator("json", z.object({ answerText: z.string() })), async (c) => {
  const { id, answerId } = c.req.param();
  const session = interviewStore.get(id);
  if (!session) throw new NotFoundError("Interview session", id);
  const ans = session.answers.find((a) => a.id === answerId);
  if (!ans) throw new NotFoundError("Answer", answerId);
  ans.answerText = c.req.valid("json").answerText;
  return c.json({ success: true, data: ans });
});

interviewRoutes.get("/:id/history", async (c) => {
  const id = c.req.param("id");
  const session = interviewStore.get(id);
  if (!session) throw new NotFoundError("Interview session", id);
  return c.json({ success: true, data: session.answers });
});
