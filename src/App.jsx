import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntervieweeView from './pages/IntervieweeView';
import InterviewerView from './pages/InterviewerView';
import { Toaster } from "@/components/ui/sonner";
import WelcomeBackModal from "./components/common/WelcomeBackModal";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <header className="mb-6">
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
      
      {/* For showing toast notifications (e.g., success/error) */}
      <Toaster />

      {/* Logic inside this component will determine if it should be shown */}
      <WelcomeBackModal />
    </div>
  );
}

export default App;