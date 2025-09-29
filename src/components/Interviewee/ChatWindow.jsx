import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from 'lucide-react';
import Timer from '../common/Timer';
import { handleUserSubmission } from '../../features/interviewThunks'; // Import the thunk
import { tickTimer } from '../../features/sessionSlice';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const scrollAreaRef = useRef(null);

  const session = useSelector(state => state.session);
  const candidate = useSelector(state => state.candidates.list.find(c => c.id === session.activeCandidateId));

  // Auto-scroll to bottom
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [candidate?.chatHistory]);

  // CORE TIMER LOGIC
  useEffect(() => {
    if (session.timerIsActive) {
      const interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);

      // Auto-submit when timer hits zero
      if (session.timerValue <= 0) {
        clearInterval(interval);
        dispatch(handleUserSubmission(currentAnswer || "")); // Submit current text or empty
        setCurrentAnswer('');
      }

      // Cleanup function to clear interval when component unmounts or timer stops
      return () => clearInterval(interval);
    }
  }, [session.timerIsActive, session.timerValue, dispatch, currentAnswer]);


  const handleSubmit = () => {
    // Only allow submission when awaiting an answer
    if (session.status !== 'awaiting_answer') return;
    dispatch(handleUserSubmission(currentAnswer));
    setCurrentAnswer('');
  };
  
  const isInputDisabled = session.status !== 'awaiting_answer';

  return (
    <Card className="w-full h-[70vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Interview in Progress</CardTitle>
        <Timer />
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
          {candidate?.chatHistory.map((msg, index) => (
            <div key={index} className={`flex mb-4 ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${msg.author === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {(session.status === 'generating_question' || session.status === 'evaluating_answer') && (
            <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is thinking...</span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={isInputDisabled}
            onKeyPress={(e) => e.key === 'Enter' && !isInputDisabled && handleSubmit()}
          />
          <Button onClick={handleSubmit} disabled={isInputDisabled}>
            <Send className="h-4 w-4"/>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;