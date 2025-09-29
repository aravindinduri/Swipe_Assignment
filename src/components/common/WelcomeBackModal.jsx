import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { endSession } from '../../features/sessionSlice';

const WelcomeBackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // Select the necessary state to decide if the modal should appear
  const { activeCandidateId, status } = useSelector(state => state.session);
  const candidate = useSelector(state => 
    state.candidates.list.find(c => c.id === activeCandidateId)
  );

  // This effect runs only once when the app loads
  useEffect(() => {
    // The condition to show the modal:
    // 1. There is an active session.
    // 2. The interview is 'in_progress' (not just collecting info or completed).
    if (activeCandidateId && candidate?.interviewStatus === 'in_progress') {
      setIsOpen(true);
    }
  }, []); // Empty dependency array means it runs only on mount

  const handleResume = () => {
    setIsOpen(false);
    // No dispatch needed. The state is already restored by redux-persist.
    // Simply closing the modal allows the user to continue.
  };

  const handleStartOver = () => {
    dispatch(endSession());
    setIsOpen(false);
    // Dispatching endSession will reset the active session,
    // causing the UI to re-render to the initial ResumeUpload state.
  };

  // We use the `open` and `onOpenChange` props to control the dialog state
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent onEscapeKeyDown={(e) => e.preventDefault()} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
          <DialogDescription>
            It looks like you didn't finish your interview session.
            Would you like to resume where you left off or start over?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleStartOver}>
            Start Over
          </Button>
          <Button onClick={handleResume}>Resume Interview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeBackModal;