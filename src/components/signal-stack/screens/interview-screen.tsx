import { useState, useEffect } from "react";
import { MessageSquareText, Layers, CheckCircle, ChevronDown, Lock, Sparkles, Building2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { InterviewQuestionCard } from "../components/interview-question-card";
import { questionsByCompany, type CompanyName, type Section } from "../data";

export function InterviewScreen({
  company,
  onNavigate,
}: {
  company: CompanyName;
  onNavigate: (section: Section) => void;
}) {
  const questions = questionsByCompany[company] || questionsByCompany.EDXSO;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [skipped, setSkipped] = useState<number[]>([]);
  const [showProfileDrawer, setShowProfileDrawer] = useState(true);

  // Reset when company changes
  useEffect(() => {
    setStep(0);
    setAnswers({});
    setSkipped([]);
  }, [company]);

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
      toast.success("Answer recorded in preview profile", {
        description: `Progress: ${step + 2} of ${questions.length}`,
      });
    } else {
      toast.success("Founder Discovery Interview Completed!", {
        description: "Your answers are now calibrating the weekly executive brief layout.",
      });
      onNavigate("profile");
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    if (!skipped.includes(step)) {
      setSkipped((prev) => [...prev, step]);
    }
    toast.info("Confidential question skipped for this session");
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const skippedCount = skipped.length;
  const totalCompleted = answeredCount + skippedCount;

  // Profile dimensions mapped to question indices
  const profilePillars = [
    { title: "Institutional Focus & Urgency", qIdx: 0 },
    { title: "Target Personas & Scale", qIdx: 1 },
    { title: "Implementation Bottlenecks", qIdx: 2 },
    { title: "Trust & Proof-Points", qIdx: 3 },
    { title: "Competitive Substitutes", qIdx: 4 },
    { title: "Regulatory Tailwinds", qIdx: 5 },
    { title: "12-Month Expansion Milestones", qIdx: 6 },
    { title: "Early Leading Indicators", qIdx: 7 },
    { title: "Confidential Constraints", qIdx: 8 },
    { title: "Executive Decision Mandate", qIdx: 9 },
  ];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1.1fr)]">
      {/* Left: Active Question Card */}
      <InterviewQuestionCard
        questionNumber={step}
        totalQuestions={questions.length}
        questionText={questions[step] ?? ""}
        answer={answers[step] ?? ""}
        onAnswerChange={(val) => setAnswers((prev) => ({ ...prev, [step]: val }))}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSkip={handleSkip}
        companyName={company}
      />

      {/* Right: Live Intelligence Profile Sidebar */}
      <aside className="signal-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Real-Time Synthesis
            </span>
            <h3 className="signal-display text-sm font-bold text-foreground">
              Live Profile Preview
            </h3>
          </div>
          <Badge variant="secondary" className="bg-brand-soft text-brand text-xs font-semibold">
            {answeredCount}/{questions.length} Answered
          </Badge>
        </div>

        <div className="rounded-lg bg-secondary/50 p-3 text-xs">
          <div className="flex justify-between font-semibold text-muted-foreground mb-1.5">
            <span>Intake Completion</span>
            <span className="text-foreground">{Math.round((totalCompleted / questions.length) * 100)}%</span>
          </div>
          <Progress
            value={(totalCompleted / questions.length) * 100}
            className="h-1.5 bg-background [&>div]:bg-primary"
          />
        </div>

        <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto pr-1">
          {profilePillars.map((pillar) => {
            const hasAnswer = Boolean(answers[pillar.qIdx]?.trim());
            const isSkipped = skipped.includes(pillar.qIdx);
            const isCurrent = step === pillar.qIdx;

            return (
              <div
                key={pillar.title}
                onClick={() => setStep(pillar.qIdx)}
                className={`py-3 cursor-pointer rounded-md px-2 transition-colors ${
                  isCurrent ? "bg-accent/60 font-semibold" : "hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">{pillar.title}</span>
                  {hasAnswer ? (
                    <Badge variant="outline" className="bg-success-soft text-success text-[9px] border-0">
                      Captured
                    </Badge>
                  ) : isSkipped ? (
                    <Badge variant="outline" className="bg-muted text-muted-foreground text-[9px] border-0">
                      Skipped
                    </Badge>
                  ) : isCurrent ? (
                    <Badge variant="outline" className="bg-brand-soft text-brand text-[9px] border-0">
                      Active
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Pending</span>
                  )}
                </div>

                <p className="mt-1 text-[11px] leading-normal text-muted-foreground line-clamp-2">
                  {hasAnswer
                    ? answers[pillar.qIdx]
                    : isSkipped
                    ? "Marked as confidential · excluded from standard brief synthesis"
                    : "Awaiting founder response…"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border/80">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("profile")}
            className="w-full text-xs"
          >
            Open Intelligence Profile Screen
          </Button>
        </div>
      </aside>
    </div>
  );
}
