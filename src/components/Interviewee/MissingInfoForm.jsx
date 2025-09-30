import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateCandidateProfile } from '../../features/candidatesSlice';
import { setSessionStatus } from '../../features/sessionSlice';

const MissingInfoForm = () => {
    const dispatch = useDispatch();
    const activeCandidateId = useSelector((state) => state.session.activeCandidateId);
    const candidate = useSelector((state) => 
        state.candidates.list.find(c => c.id === activeCandidateId)
    );
    
    const [formData, setFormData] = useState({
        name: candidate?.profile?.name || '',
        email: candidate?.profile?.email || '',
        phone: candidate?.profile?.phone || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCandidateProfile({ candidateId: activeCandidateId, profile: formData }));
        dispatch(setSessionStatus('in_progress'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Just a Few More Details</CardTitle>
                <CardDescription>We couldn't find some information on your resume. Please fill it in below to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!candidate?.profile?.name && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={formData.name} onChange={handleChange} required />
                        </div>
                    )}
                    {!candidate?.profile?.email && (
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    )}
                    {!candidate?.profile?.phone && (
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                    )}
                    <Button type="submit" className="w-full">Start Interview</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default MissingInfoForm;