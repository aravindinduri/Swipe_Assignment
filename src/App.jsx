import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import IntervieweeView from './pages/IntervieweeView';
import InterviewerView from './pages/InterviewerView';
import { Toaster } from "@/components/ui/sonner";
import WelcomeBackModal from "./components/common/WelcomeBackModal";
import { setSessionReady } from './features/sessionSlice';
import { Mic, Eye, Workflow } from 'lucide-react';
import { toast } from 'sonner';
function App() {
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const candidate = useSelector(state =>
    state.candidates.list.find(c => c.id === session.activeCandidateId)
  );

  const [activeTab, setActiveTab] = useState("interviewee");

  const gatekeeperEffectRan = useRef(false);
  useEffect(() => {
    if (gatekeeperEffectRan.current === true) return;
    if (session.activeCandidateId && (candidate?.interviewStatus === 'in_progress' ||
    candidate?.interviewStatus === 'collecting_info'
    )) {
      dispatch(setSessionReady(false));
    }
    gatekeeperEffectRan.current = true;
  }, [dispatch, session.activeCandidateId, candidate]);

  const handleTabChange = (value) => {
    if (
      candidate?.interviewStatus === "in_progress" &&
      value === "interviewer"
    ) {
      toast.warning("You can review after the interview is complete.");
      return; 
    }
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col">
      <div className="border-b border-zinc-800 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <Workflow className="h-5 w-5 text-black" fill="currentColor" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Crisp</span>
          </div>
          <div className="text-sm text-zinc-500">AI Interview Platform</div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <Card className="w-full bg-zinc-800/50 border-zinc-700 shadow-xl backdrop-blur">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-700 p-1 mb-8">
                <TabsTrigger
                  value="interviewee"
                  className="flex items-center gap-2 text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-zinc-600 rounded"
                >
                  <Mic className="h-4 w-4" />
                  Interview
                </TabsTrigger>
                <TabsTrigger
                  value="interviewer"
                  className="flex items-center gap-2 text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-zinc-600 rounded"
                >
                  <Eye className="h-4 w-4" />
                  Review
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interviewee" className="mt-0">
                <IntervieweeView />
              </TabsContent>
              <TabsContent value="interviewer" className="mt-0">
                <InterviewerView />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <div className="border-t border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>&copy; {new Date().getFullYear()} Crisp</span>
          </div>
        </div>
      </div>

      <Toaster richColors position="top-right" />
      <WelcomeBackModal />
    </div>
  );
}

export default App;
