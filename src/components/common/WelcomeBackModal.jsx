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
import { endSession, setSessionReady } from '../../features/sessionSlice';

const WelcomeBackModal = () => {
  const dispatch = useDispatch();

  const isSessionLocked = useSelector(state => !state.session.isSessionReady);

  const handleResume = () => {
   
    dispatch(setSessionReady(true));
  };

  const handleStartOver = () => {
 
    dispatch(endSession());
  };

  const handleOpenChange = (open) => {
    if (!open) {
      handleResume();
    }
  };

  return (
    <Dialog open={isSessionLocked} onOpenChange={handleOpenChange}>
      <DialogContent
   
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
          <DialogDescription>
            It looks like you didn't finish your interview session.
            Would you like to resume where you left off or start over?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
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