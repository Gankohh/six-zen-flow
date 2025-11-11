import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

type MeditationState = "idle" | "meditating" | "complete";

type Phase = {
  name: string;
  duration: number; // in seconds
  guidance: string;
  visualType: "fade-in" | "focus-point" | "breathing" | "expansion" | "fade-out";
};

const phases: Phase[] = [
  {
    name: "姿勢を整える",
    duration: 30,
    guidance: "椅子または床に座りましょう。背筋をやさしく伸ばし、目を閉じます。静かに呼吸を感じてください。",
    visualType: "fade-in",
  },
  {
    name: "視覚フォーカス",
    duration: 60,
    guidance: "まぶたを軽く開き、ひとつの点を静かに見つめます。瞬きは自由です。視線を一点に置きましょう。",
    visualType: "focus-point",
  },
  {
    name: "呼吸誘導",
    duration: 120,
    guidance: "息を吸いながら、意識を内に。4秒吸って、4秒で吐きましょう。もし雑念が浮かんだら、それに気づいて呼吸に戻ります。",
    visualType: "breathing",
  },
  {
    name: "注意切り替え",
    duration: 60,
    guidance: "次に、意識を変えてみましょう。足の裏や手のひら、身体の重さを感じるか、あるいは周囲の音や光を感じてみましょう。",
    visualType: "expansion",
  },
  {
    name: "終わりのリセット",
    duration: 90,
    guidance: "最後に、深呼吸をひとつ。今日これから行うことを静かに思い浮かべましょう。ゆっくりと目を開けてください。",
    visualType: "fade-out",
  },
];

const Index = () => {
  const [state, setState] = useState<MeditationState>("idle");
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [elapsedInPhase, setElapsedInPhase] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const currentPhase = phases[currentPhaseIndex];
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

  useEffect(() => {
    if (state !== "meditating") return;

    const interval = setInterval(() => {
      setElapsedInPhase((prev) => prev + 1);
      setTotalElapsed((prev) => prev + 1);

      if (elapsedInPhase + 1 >= currentPhase.duration) {
        if (currentPhaseIndex < phases.length - 1) {
          setCurrentPhaseIndex((prev) => prev + 1);
          setElapsedInPhase(0);
        } else {
          setState("complete");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state, elapsedInPhase, currentPhaseIndex, currentPhase.duration]);

  const startMeditation = () => {
    setState("meditating");
    setCurrentPhaseIndex(0);
    setElapsedInPhase(0);
    setTotalElapsed(0);
  };

  const resetMeditation = () => {
    setState("idle");
    setCurrentPhaseIndex(0);
    setElapsedInPhase(0);
    setTotalElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (state === "idle") {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(var(--meditation-bg-start))] to-[hsl(var(--meditation-bg-end))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
        
        <div className="relative z-10 text-center space-y-8 animate-fade-in-up px-4">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-light text-foreground tracking-wide">
              6分間瞑想
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              ハバーマン式 ノンストップ誘導
            </p>
          </div>

          <div className="pt-8">
            <Button
              onClick={startMeditation}
              size="lg"
              className="group relative h-16 px-12 text-lg font-light bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/60 rounded-full transition-all duration-300"
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              始める
            </Button>
          </div>

          <div className="pt-12 text-sm text-muted-foreground space-y-2">
            <p>静かな場所で、快適な姿勢で座ってください</p>
            <p className="text-xs opacity-70">6分間、自動で進行します</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "complete") {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(var(--meditation-bg-start))] to-[hsl(var(--meditation-bg-end))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
        
        <div className="relative z-10 text-center space-y-8 animate-fade-in-up px-4">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-light text-foreground">
              完了
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              お疲れ様でした
            </p>
          </div>

          <div className="pt-8">
            <Button
              onClick={resetMeditation}
              size="lg"
              className="h-14 px-10 text-lg font-light bg-secondary hover:bg-secondary/80 rounded-full transition-all duration-300"
            >
              <RotateCcw className="mr-3 h-5 w-5" />
              もう一度
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(var(--meditation-bg-start))] to-[hsl(var(--meditation-bg-end))]">
      {/* Background ambient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />

      {/* Visual Element based on phase */}
      <div className="absolute inset-0 flex items-center justify-center">
        {currentPhase.visualType === "fade-in" && (
          <div className="w-96 h-96 rounded-full bg-[hsl(var(--focus-light))] opacity-10 blur-3xl animate-pulse-soft" />
        )}
        
        {currentPhase.visualType === "focus-point" && (
          <div className="w-4 h-4 rounded-full bg-[hsl(var(--focus-light))] animate-glow" />
        )}
        
        {currentPhase.visualType === "breathing" && (
          <div className="w-64 h-64 rounded-full border-2 border-[hsl(var(--breath-circle))] animate-breathe" />
        )}
        
        {currentPhase.visualType === "expansion" && (
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-[hsl(var(--focus-light))]/20 to-transparent animate-pulse-soft" />
        )}
        
        {currentPhase.visualType === "fade-out" && (
          <div className="w-96 h-96 rounded-full bg-white/5 blur-3xl opacity-30" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-12">
        {/* Timer */}
        <div className="text-6xl md:text-7xl font-extralight text-foreground/60 tracking-wider">
          {formatTime(totalDuration - totalElapsed)}
        </div>

        {/* Phase name */}
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-2xl md:text-3xl font-light text-foreground">
            {currentPhase.name}
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
            {currentPhase.guidance}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-full max-w-md mx-auto space-y-3">
          <div className="h-1 bg-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/60 transition-all duration-1000 ease-linear"
              style={{ width: `${(totalElapsed / totalDuration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground/60">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`transition-opacity ${
                  index === currentPhaseIndex ? "opacity-100" : "opacity-30"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
