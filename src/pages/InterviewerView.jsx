import CandidateList from '@/components/Interviewer/CandidateList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InterviewerView = () => {
    return (
        <div className="min-h-screen bg-zinc-900 p-6 sm:p-10">
            <Card className="bg-zinc-800/60 border-zinc-700 rounded-xl shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl text-white font-semibold">Candidate Dashboard</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                        Review all candidates who have completed the interview.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <CandidateList />
                </CardContent>
            </Card>
        </div>
    );
};

export default InterviewerView;
