import CandidateList from '@/components/Interviewer/CandidateList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InterviewerView = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Candidate Dashboard</CardTitle>
                <CardDescription>Review all candidates who have completed the interview.</CardDescription>
            </CardHeader>
            <CardContent>
                <CandidateList />
            </CardContent>
        </Card>
    );
};

export default InterviewerView;