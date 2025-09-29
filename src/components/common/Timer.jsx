import React from 'react';
import { useSelector } from 'react-redux';
import { Badge } from "@/components/ui/badge";

const Timer = () => {
  const { timerValue, timerIsActive, currentQuestion } = useSelector(state => state.session);

  if (!timerIsActive) return null;

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

  return (
    <div className="flex items-center gap-2">
        <Badge variant={getDifficultyVariant(currentQuestion.difficulty)}>
            {currentQuestion.difficulty}
        </Badge>
        <Badge variant={isLowTime ? "destructive" : "secondary"}>
            Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Badge>
    </div>
  );
};

export default Timer;