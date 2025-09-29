import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CandidateDetailModal from './CandidateDetailModal';

const CandidateList = () => {
  const candidates = useSelector(state => state.candidates.list)
    .filter(c => c.interviewStatus === 'completed')
    .sort((a, b) => b.finalScore - a.finalScore);
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  if (candidates.length === 0) {
    return <p className="text-muted-foreground text-center p-8">No completed interviews yet.</p>;
  }

  return (
    <Dialog>
      <Card>
        <CardHeader><CardTitle>Interview Dashboard</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.profile.name}</TableCell>
                  <TableCell>{candidate.profile.email}</TableCell>
                  <TableCell className="text-right">{candidate.finalScore.toFixed(1)} / 10</TableCell>
                  <TableCell className="text-center">
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedCandidate(candidate)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* The Dialog Content is a separate component for cleanliness */}
      <CandidateDetailModal candidate={selectedCandidate} />
    </Dialog>
  );
};

export default CandidateList;