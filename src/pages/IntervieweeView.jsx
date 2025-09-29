import { useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import ResumeUpload from '@/components/Interviewee/ResumeUpload';
import MissingInfoForm from '@/components/Interviewee/MissingInfoForm';
import ChatWindow from '@/components/Interviewee/ChatWindow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { fetchNextQuestion } from '../features/interviewThunks'; 

const IntervieweeView = () => {
  const dispatch = useDispatch();
  const sessionStatus = useSelector((state) => state.session.status);
  const activeCandidateId = useSelector((state) => state.session.activeCandidateId);
  
  const candidate = useSelector((state) => 
    state.candidates.list.find(c => c.id === activeCandidateId)
  );

  useEffect(() => {
    if (sessionStatus === 'in_progress') {
      console.log("IntervieweeView: Status is 'in_progress'. Dispatching fetchNextQuestion.");

      dispatch(fetchNextQuestion());
    }
  }, [sessionStatus, dispatch]);
  switch (sessionStatus) {
    case 'idle':
      return <ResumeUpload />;
    
    case 'collecting_info':
      return <MissingInfoForm />;

    case 'in_progress': 
    case 'generating_question':
    case 'awaiting_answer':
    case 'evaluating_answer':
      return <ChatWindow />;

    case 'finished':
      return (
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>Interview Complete!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p>Thank you for completing the interview.</p>
            <p className="text-muted-foreground">You can now close this tab. The interviewer has received your results.</p>
            {candidate && (
                <p className="font-bold text-lg">Final Score: {candidate.finalScore.toFixed(1)} / 10</p>
            )}
          </CardContent>
        </Card>
      );
      
    default:
      return <ResumeUpload />;
  }
};

export default IntervieweeView;