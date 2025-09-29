import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Mic, MicOff, CheckCircle2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { handleUserSubmission } from '../../features/interviewThunks';
import { tickTimer } from '../../features/sessionSlice';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const scrollAreaRef = useRef(null);

  const session = useSelector(state => state.session);
  const candidate = useSelector(state => state.candidates.list.find(c => c.id === session.activeCandidateId));

  const allQuestions = candidate?.chatHistory?.filter(msg => msg.author !== 'user') || [];
  const userAnswers = candidate?.chatHistory?.filter(msg => msg.author === 'user') || [];
  
  const currentQuestionIndex = allQuestions.findIndex((_, index) => !answeredQuestions.has(index));
  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = 6;

  useEffect(() => {
    if (userAnswers.length > answeredQuestions.size && currentQuestionIndex >= 0) {
      setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
    }
  }, [userAnswers.length, answeredQuestions.size, currentQuestionIndex]);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [candidate?.chatHistory]);

  useEffect(() => {
    if (session.timerIsActive) {
      const interval = setInterval(() => dispatch(tickTimer()), 1000);
      if (session.timerValue <= 0) {
        clearInterval(interval);
        dispatch(handleUserSubmission(currentAnswer || ""));
        setCurrentAnswer('');
      }
      return () => clearInterval(interval);
    }
  }, [session.timerIsActive, session.timerValue, dispatch, currentAnswer]);

  const handleSubmit = () => {
    if (session.status !== 'awaiting_answer' || !currentAnswer.trim()) return;
    dispatch(handleUserSubmission(currentAnswer));
    setCurrentAnswer('');
    if (isListening) stopListening();
  };

  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition();
  useEffect(() => { if (transcript) setCurrentAnswer(transcript); }, [transcript]);
  const handleMicClick = () => isListening ? stopListening() : startListening();

  const isInputDisabled = session.status !== 'awaiting_answer';
  const isInterviewComplete = answeredQuestions.size >= totalQuestions;

  const totalTime = currentQuestion?.timeLimit || 60;
  const timeProgress = currentQuestion ? Math.max(0, (session.timerValue / totalTime) * 100) : 0;

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-zinc-900/50 p-4">
      <Card className="w-full max-w-4xl bg-zinc-800/60 border border-zinc-700 rounded-xl shadow-lg flex flex-col">
        
        {/* Header */}
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-white font-semibold">Technical Interview</CardTitle>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant={isInterviewComplete ? "default" : "secondary"}>
              {isInterviewComplete ? 'Completed' : 'In Progress'}
            </Badge>
            <span className="text-sm text-zinc-400">
              {answeredQuestions.size} of {totalQuestions} answered
            </span>
          </div>
        </CardHeader>

        {/* Chat Content */}
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full pr-2">
            
            {isInterviewComplete ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Interview Complete!</h3>
                <p className="text-zinc-400 max-w-md text-lg">
                  Thank you for completing all {totalQuestions} questions. Your responses have been recorded.
                </p>
              </div>
            ) : currentQuestion ? (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-6 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">Q</div>
                    <div>
                      <span className="text-white font-medium">Question {currentQuestionIndex + 1}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{currentQuestion.difficulty || 'Medium'}</Badge>
                        <Badge variant="outline" className="text-xs text-zinc-400">
                          Time: {Math.floor(session.timerValue / 60)}:{(session.timerValue % 60).toString().padStart(2, '0')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-100 text-lg leading-relaxed whitespace-pre-wrap font-medium mb-4">
                  {currentQuestion.content}
                </p>

                {/* Timer Progress Bar */}
                <Progress 
                  value={timeProgress} 
                  className={`h-2 rounded-lg ${timeProgress <= 20 ? 'bg-red-500/30' : 'bg-emerald-500/30'}`} 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {session.status === 'generating_question' ? 'Preparing Your Question' : 'Getting Ready'}
                </h3>
                <p className="text-zinc-400 max-w-sm text-lg">
                  {session.status === 'generating_question' ? 'AI is crafting your next question...' : 'The interview will begin shortly...'}
                </p>
              </div>
            )}

          </ScrollArea>
        </CardContent>

        {!isInterviewComplete && session.status === 'awaiting_answer' && (
          <CardFooter className="border-t border-zinc-700 flex flex-col gap-3">
            <div className="flex items-center gap-3 w-full">
            <TextareaAutosize
  value={currentAnswer}
  onChange={(e) => setCurrentAnswer(e.target.value)}
  placeholder={isListening ? "Listening..." : "Type your answer here..."}
  disabled={isInputDisabled}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isInputDisabled) {
      e.preventDefault();
      handleSubmit();
    }
  }}
  minRows={1}
  maxRows={6}
  className="flex-1 resize-none py-3 px-4 text-white bg-zinc-800/50 border border-zinc-600 
             focus:border-emerald-400 rounded-lg w-full leading-relaxed"
/>
              {isSupported && (
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleMicClick}
                  disabled={isInputDisabled}
                  className="w-14 h-10 flex items-center justify-center"
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isInputDisabled || !currentAnswer.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-lg flex items-center gap-2"
              >
                <ArrowRightCircle className="h-6 w-10" /> Submit
              </Button>
            </div>
          </CardFooter>
        )}

      </Card>
    </div>
  );
};

export default ChatWindow; 