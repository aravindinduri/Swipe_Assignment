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
    <DialogContent
      className="w-full max-w-[95%] sm:max-w-3xl md:max-w-4xl lg:max-w-2xl xl:max-w-[90%]
                 bg-zinc-900 border border-zinc-700 text-white rounded-xl p-4 sm:p-6
                 flex flex-col max-h-[90vh] overflow-auto"
    >
      {/* Header */}
      <DialogHeader className="mb-4 sm:mb-6">
        <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-white break-words">
          {candidate.profile.name}
        </DialogTitle>
        <DialogDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-zinc-400 mt-2 sm:mt-3 text-xs sm:text-sm break-words">
          <span className="flex items-center gap-1.5 break-words">
            <Mail className="h-4 w-4" />
            {candidate.profile.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            Score: {candidate.finalScore.toFixed(1)}/10
          </span>
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 sm:mt-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <MessageSquare className="h-5 w-5 text-emerald-500" />
          <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-zinc-300">
            AI Summary
          </h3>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700 p-3 sm:p-4 rounded text-xs sm:text-sm text-zinc-300 leading-relaxed break-words">
          {candidate.summary}
        </div>
      </div>

      <Separator className="my-4 sm:my-6 bg-zinc-800" />

      {/* Interview Transcript */}
      <div className="flex items-center gap-2 mb-2 sm:mb-4">
        <Award className="h-5 w-5 text-emerald-500" />
        <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-zinc-300">
          Interview Transcript
        </h3>
      </div>

      <ScrollArea className="flex-1 min-h-[40vh] sm:min-h-[60vh] overflow-auto">
        <div className="pr-2 sm:pr-4 space-y-4 sm:space-y-6">
          {candidate.interviewData.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 sm:p-4 hover:border-zinc-600 transition-colors flex flex-col sm:flex-row gap-3 break-words"
            >
              {/* Question Number */}
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs sm:text-sm font-medium text-zinc-300">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                {/* Question */}
                <p className="font-semibold text-zinc-200 mb-1 sm:mb-2 text-xs sm:text-sm break-words">
                  Q: {item.question}
                </p>

                {/* Answer */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed p-2 sm:p-3 bg-zinc-900/50 border-l-4 border-emerald-500 rounded-l break-words">
                  {item.answer || "No answer provided."}
                </p>

                {/* Score & Feedback */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs break-words">
                  <span className="px-2 py-1 rounded bg-emerald-900/40 text-emerald-400 font-semibold">
                    Score: {item.score}/10
                  </span>
                  {item.feedback && (
                    <span className="text-zinc-400 italic break-words">{item.feedback}</span>
                  )}
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
