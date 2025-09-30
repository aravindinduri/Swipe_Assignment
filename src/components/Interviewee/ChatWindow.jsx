import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const currentQuestionIndex = session?.currentQuestionIndex || 0;
  const currentQuestion = session.currentQuestion.text ? session.currentQuestion : allQuestions[currentQuestionIndex] || null;
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
    <div className="flex justify-center items-center min-h-[80vh] sm:min-h-[70vh] bg-zinc-900/50 p-2 sm:p-4">
      <Card className="w-full max-w-4xl bg-zinc-800/60 border border-zinc-700 rounded-xl shadow-lg flex flex-col">

        <CardHeader className="pb-2">
          <CardTitle className="text-xl sm:text-2xl text-white font-semibold">Technical Interview</CardTitle>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant={isInterviewComplete ? "default" : "secondary"}>
              {isInterviewComplete ? 'Completed' : 'In Progress'}
            </Badge>
            <span className="text-sm text-zinc-400">
              {answeredQuestions.size + 1} of {totalQuestions} answered
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full pr-2 md:pr-4">

            {isInterviewComplete ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse">
                  <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">Interview Complete!</h3>
                <p className="text-base sm:text-lg text-zinc-400 max-w-md">
                  Thank you for completing all {totalQuestions} questions. Your responses have been recorded.
                </p>
              </div>
            ) : currentQuestion ? (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 sm:p-6 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">Q</div>
                    <div>
                      <span className="text-white font-medium">Question {currentQuestionIndex + 1}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{currentQuestion?.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs text-zinc-400">
                          Time: {Math.floor(session.timerValue / 60)}:{(session.timerValue % 60).toString().padStart(2, '0')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-zinc-100 leading-relaxed whitespace-pre-wrap font-medium mb-4">
                  {currentQuestion.text}
                </p>

                <Progress
                  value={timeProgress}
                  className={`h-2 rounded-lg ${timeProgress <= 20 ? 'bg-red-500/30' : 'bg-emerald-500/30'}`}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-emerald-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                  {session.status === 'generating_question' ? 'Preparing Your Question' : 'Getting Ready'}
                </h3>
                <p className="text-base sm:text-lg text-zinc-400 max-w-sm">
                  {session.status === 'generating_question' ? 'AI is crafting your next question...' : 'The interview will begin shortly...'}
                </p>
              </div>
            )}

          </ScrollArea>
        </CardContent>

        {!isInterviewComplete && session.status === 'awaiting_answer' && (
          <CardFooter className="border-t border-zinc-700 p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
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
                className="flex-1 resize-none w-full py-2 px-3 sm:py-3 sm:px-4 text-white bg-zinc-800/50 border border-zinc-600 focus:border-emerald-400 rounded-lg leading-relaxed"
              />
              {/* FIX: This container now correctly handles button layout on mobile and larger screens. */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {isSupported && (
                  <Button
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    onClick={handleMicClick}
                    disabled={isInputDisabled}
                    className="h-10 w-12 flex items-center justify-center flex-shrink-0"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={isInputDisabled || !currentAnswer.trim()}
                  // FIX: Added `flex-1` to allow this button to fill remaining space on mobile.
                  // `sm:flex-none` and `sm:w-auto` resets this behavior for larger screens.
                  className="flex-1 sm:flex-none sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white h-10 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2"
                >
                  <ArrowRightCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">Submit</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        )}

      </Card>
    </div>
  );
};

export default ChatWindow;