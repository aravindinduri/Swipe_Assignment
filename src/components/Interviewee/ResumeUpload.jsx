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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Begin Your Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-muted rounded-lg p-12 text-center cursor-pointer hover:border-primary"
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
            <div>
              <p className="mb-2">Processing...</p>
              <Progress value={progress} className="w-full" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadCloud size={48} />
              <p className="font-semibold">Click or drag file to this area to upload</p>
              <p className="text-sm">Please upload your resume (PDF or DOCX)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;