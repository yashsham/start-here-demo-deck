import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, LockKeyhole, MessageSquare, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { questionGuidance } from "../data";

interface InterviewQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  companyName: string;
}

export function InterviewQuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  answer,
  onAnswerChange,
  onPrevious,
  onNext,
  onSkip,
  companyName,
}: InterviewQuestionCardProps) {
  const [showGuidance, setShowGuidance] = useState(true);
  const guidance = questionGuidance[questionNumber] || {
    hint: "Provide candid operational context to help calibrate the weekly executive intelligence brief.",
    suggestedAreas: ["Strategy", "Execution", "Pain Points"],
  };

  const progressPercent = Math.round(((questionNumber + 1) / totalQuestions) * 100);

  return (
    <section className="signal-panel p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
            Executive Founder Conversation · {companyName}
          </span>
          <h2 className="signal-display mt-1 text-base font-bold text-foreground sm:text-lg">
            Strategic Discovery Intake
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold">
            Question {questionNumber + 1} of {totalQuestions}
          </Badge>
          <span className="text-xs font-bold text-brand">{progressPercent}%</span>
        </div>
      </div>

      <Progress value={progressPercent} className="h-2 bg-secondary [&>div]:bg-primary" />

      <div className="rounded-xl border border-brand/20 bg-brand-soft/40 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand">
          <MessageSquare className="size-3.5" />
          <span>Core Inquiry</span>
        </div>
        <h3 className="signal-display mt-3 text-base font-bold leading-relaxed text-foreground sm:text-xl">
          {questionText}
        </h3>

        {showGuidance && (
          <div className="mt-4 rounded-lg border border-border/80 bg-card/90 p-3.5 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Sparkles className="size-3.5 text-brand" />
                Interviewer Guidance & Context
              </span>
              <button
                type="button"
                onClick={() => setShowGuidance(false)}
                className="text-[10px] text-muted-foreground hover:underline"
              >
                Hide
              </button>
            </div>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">{guidance.hint}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-medium text-foreground/80">Suggested focus areas:</span>
              {guidance.suggestedAreas.map((area) => (
                <span
                  key={area}
                  className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="interview-answer-input" className="text-xs font-semibold text-foreground">
            Founder's Perspective & Notes
          </label>
          <span className="text-[11px] text-muted-foreground">
            {answer.length} / 1500 chars
          </span>
        </div>
        <Textarea
          id="interview-answer-input"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          maxLength={1500}
          placeholder="Capture specific context, operational nuances, priority criteria, and known trade-offs…"
          className="min-h-[140px] text-sm leading-relaxed"
        />
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <LockKeyhole className="size-3 text-success shrink-0" />
          <span>
            Answers remain isolated within your local preview profile until explicitly published to a live team brief.
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={questionNumber === 0}
          className="h-9 gap-1.5 px-3 text-xs"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            Skip confidential
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onNext}
            className="h-9 gap-1.5 px-4 text-xs font-semibold"
          >
            {questionNumber === totalQuestions - 1 ? "Complete Interview" : "Save & Continue"}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
