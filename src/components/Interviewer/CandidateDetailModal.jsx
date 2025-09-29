import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail, Target, MessageSquare, Award } from 'lucide-react';

const CandidateDetailModal = ({ candidate }) => {
  if (!candidate) return null;

  return (
    <DialogContent className="max-w-3xl bg-zinc-900 border-zinc-700 text-white">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">{candidate.profile.name}</DialogTitle>
        <DialogDescription className="flex items-center gap-4 text-zinc-400 mt-2">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {candidate.profile.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Score: {candidate.finalScore.toFixed(1)}/10
          </span>
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-emerald-500" />
          <h3 className="font-medium text-sm uppercase tracking-wide text-zinc-300">AI Summary</h3>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700 p-4 rounded text-sm text-zinc-300 leading-relaxed">
          {candidate.summary}
        </div>
      </div>

      <Separator className="my-6 bg-zinc-800" />

      <div className="flex items-center gap-2 mb-4">
        <Award className="h-4 w-4 text-emerald-500" />
        <h3 className="font-medium text-sm uppercase tracking-wide text-zinc-300">Interview Transcript</h3>
      </div>
      
      <ScrollArea className="h-80">
        <div className="pr-4 space-y-5">
          {candidate.interviewData.map((item, index) => (
            <div key={index} className="bg-zinc-800/40 border border-zinc-700/50 rounded p-4 hover:border-zinc-600 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-300">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-200 mb-2">{item.question}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3 pl-3 border-l-2 border-zinc-700">
                    {item.answer || "No answer provided."}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-1 rounded bg-zinc-700/50 text-emerald-400 font-medium">
                      {item.score}/10
                    </span>
                    <span className="text-zinc-500">{item.feedback}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default CandidateDetailModal;