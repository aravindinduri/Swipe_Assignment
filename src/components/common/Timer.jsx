import React from 'react';
import { useSelector } from 'react-redux';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Timer = () => {
  const { timerValue, timerIsActive, currentQuestion } = useSelector(state => state.session);

  if (!timerIsActive || !currentQuestion) return null;

  const minutes = Math.floor(timerValue / 60);
  const seconds = timerValue % 60;

  const isLowTime = timerValue <= 10;

  const getDifficultyVariant = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'default';
      case 'Medium': return 'secondary';
      case 'Hard': return 'destructive';
      default: return 'outline';
    }
  }

  const totalTime = currentQuestion.timeLimit || 60; // fallback 60s
  const progressPercent = Math.max(0, (timerValue / totalTime) * 100);

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <Badge variant={getDifficultyVariant(currentQuestion.difficulty)}>
          {currentQuestion.difficulty}
        </Badge>
        <Badge variant={isLowTime ? "destructive" : "secondary"}>
          Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Badge>
      </div>
      <Progress 
        value={progressPercent} 
        className={`h-2 w-full rounded-md ${isLowTime ? 'bg-red-500/20' : 'bg-emerald-500/20'}`} 
        style={{ '--radix-progress-value': progressPercent }} 
      />
    </div>
  );
};

export default Timer;
