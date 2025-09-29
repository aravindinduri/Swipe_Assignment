import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UploadCloud } from 'lucide-react';
import { processResumeAndVerify } from '../../features/interviewThunks';

const ResumeUpload = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    await dispatch(processResumeAndVerify({ file, onProgress: setProgress }));
    setLoading(false);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-lg bg-zinc-800/60 border border-zinc-700 rounded-xl shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-white font-semibold">Begin Your Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-zinc-600 rounded-lg p-12 text-center cursor-pointer hover:border-emerald-400 transition-colors duration-200 bg-zinc-900/20"
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={(e) => handleFile(e.target.files[0])}
              disabled={loading}
            />
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-white font-medium mb-2">Processing...</p>
                <Progress value={progress} className="w-full h-2 rounded-lg bg-zinc-700" />
                <p className="text-sm text-zinc-400 mt-1">{progress.toFixed(0)}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <UploadCloud size={48} className="text-emerald-400" />
                <p className="font-semibold text-white">Click or drag file to this area to upload</p>
                <p className="text-sm text-zinc-400">Please upload your resume (PDF or DOCX)</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeUpload;
