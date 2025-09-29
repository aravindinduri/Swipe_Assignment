import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import Timer from '../common/Timer';
import { handleUserSubmission } from '../../features/interviewThunks';
import { tickTimer } from '../../features/sessionSlice';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const scrollAreaRef = useRef(null);

  const session = useSelector(state => state.session);
  const candidate = useSelector(state => state.candidates.list.find(c => c.id === session.activeCandidateId));

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [candidate?.chatHistory]);

  useEffect(() => {
    if (session.timerIsActive) {
      const interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);

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
    if (isListening) {
      stopListening();
    }
  };
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setCurrentAnswer(transcript);
    }
  }, [transcript]);
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
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
            placeholder={isListening ? "Listening..." : "Type or say your answer..."}
            disabled={isInputDisabled}
            onKeyPress={(e) => e.key === 'Enter' && !isInputDisabled && handleSubmit()}
          />
          {isSupported && (
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={handleMicClick}
              disabled={isInputDisabled}
              type="button"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isInputDisabled || !currentAnswer.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;