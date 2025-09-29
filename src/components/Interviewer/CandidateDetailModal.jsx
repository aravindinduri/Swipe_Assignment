import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const CandidateDetailModal = ({ candidate }) => {
  if (!candidate) return null;

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{candidate.profile.name}'s Interview Results</DialogTitle>
        <DialogDescription>
          Score: {candidate.finalScore.toFixed(1)}/10 | Email: {candidate.profile.email}
        </DialogDescription>
      </DialogHeader>
      
      <div className="my-4">
        <h3 className="font-semibold mb-2">AI Summary</h3>
        <p className="text-sm bg-muted p-3 rounded-md">{candidate.summary}</p>
      </div>

      <Separator />

      <h3 className="font-semibold my-4">Full Transcript</h3>
      <ScrollArea className="h-72">
        <div className="pr-6">
            {candidate.interviewData.map((item, index) => (
            <div key={index} className="mb-4">
                <p className="font-bold">Q{index + 1}: {item.question}</p>
                <p className="mt-1 pl-4 border-l-2">A: {item.answer || "No answer provided."}</p>
                <p className="mt-2 text-xs text-muted-foreground pl-4">
                Score: {item.score}/10 — {item.feedback}
                </p>
            </div>
            ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default CandidateDetailModal;