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
    <DialogContent className="w-full max-w-5xl sm:max-w-4xl md:max-w-3xl lg:max-w-2xl xl:max-w-[90%] bg-zinc-900 border-zinc-700 text-white rounded-xl p-6 sm:p-8">
      <DialogHeader className="mb-4 sm:mb-6">
        <DialogTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {candidate.profile.name}
        </DialogTitle>
        <DialogDescription className="flex flex-col sm:flex-row sm:items-center gap-3 text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-base">
          <span className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            {candidate.profile.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            Score: {candidate.finalScore.toFixed(1)}/10
          </span>
        </DialogDescription>
      </DialogHeader>

      {/* AI Summary */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-emerald-500" />
          <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wide text-zinc-300">
            AI Summary
          </h3>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700 p-4 rounded text-sm sm:text-base text-zinc-300 leading-relaxed">
          {candidate.summary}
        </div>
      </div>

      <Separator className="my-6 bg-zinc-800" />

      {/* Interview Transcript */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-emerald-500" />
        <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wide text-zinc-300">
          Interview Transcript
        </h3>
      </div>

      <ScrollArea className="h-80 sm:h-96 lg:h-[28rem]">
        <div className="pr-4 space-y-6">
          {candidate.interviewData.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Question Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-300">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Question */}
                  <p className="font-semibold text-zinc-200 mb-2 text-sm sm:text-base">
                    Q: {item.question}
                  </p>

                  {/* Answer */}
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-3 p-3 bg-zinc-900/50 border-l-4 border-emerald-500 rounded-l">
                    {item.answer || "No answer provided."}
                  </p>

                  {/* Score & Feedback */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <span className="px-2 py-1 rounded bg-emerald-900/40 text-emerald-400 font-semibold">
                      Score: {item.score}/10
                    </span>
                    {item.feedback && (
                      <span className="text-zinc-400 italic">{item.feedback}</span>
                    )}
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
