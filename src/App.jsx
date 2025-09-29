import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntervieweeView from './pages/IntervieweeView';
import InterviewerView from './pages/InterviewerView';
import { Toaster } from "@/components/ui/sonner";
import WelcomeBackModal from "./components/common/WelcomeBackModal";
import { setSessionReady } from './features/sessionSlice';

function App() {
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const candidate = useSelector(state => 
    state.candidates.list.find(c => c.id === session.activeCandidateId)
  );

 
  const gatekeeperEffectRan = useRef(false);

  useEffect(() => {
    if (gatekeeperEffectRan.current === true) return;

    if (session.activeCandidateId && candidate?.interviewStatus === 'in_progress') {
      dispatch(setSessionReady(false));
    }
    
    gatekeeperEffectRan.current = true;
    console.log("Gatekeeper Check:");
    console.log("Active Candidate ID:", session.activeCandidateId);
    console.log("Candidate Object:", candidate);
    console.log("Candidate Interview Status:", candidate?.interviewStatus);

    if (session.activeCandidateId && candidate?.interviewStatus === 'in_progress') {
      console.log("CONDITION MET: Locking session for Welcome Back modal.");
      dispatch(setSessionReady(false));
    } else {
      console.log("CONDITION NOT MET: Proceeding directly.");
    }
  }, [dispatch, session.activeCandidateId, candidate]); 


  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Crisp AI Interview</h1>
        <p className="text-muted-foreground">Your AI-Powered Interview Assistant</p>
      </header>
      
      <Tabs defaultValue="interviewee" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interviewee">Interviewee</TabsTrigger>
          <TabsTrigger value="interviewer">Interviewer</TabsTrigger>
        </TabsList>
        <TabsContent value="interviewee">
          <IntervieweeView />
        </TabsContent>
        <TabsContent value="interviewer">
          <InterviewerView />
        </TabsContent>
      </Tabs>
      
      <Toaster richColors />

      <WelcomeBackModal />
    </div>
  );
}

export default App;