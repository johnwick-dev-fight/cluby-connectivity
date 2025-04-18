
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRecruitmentById } from '@/lib/mongodb/services/recruitmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ApplyForm from '@/components/recruitment/ApplyForm';
import RecruitmentNotFound from '@/components/errors/RecruitmentNotFound';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: position, isLoading, error } = useQuery({
    queryKey: ['recruitment', id],
    queryFn: () => getRecruitmentById(id || ''),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !position?.data) {
    return <RecruitmentNotFound />;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apply for Position</h1>
        <p className="text-muted-foreground">Submit your application for {position.data.title}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Position Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-lg">{position.data.title}</h2>
              <p className="text-muted-foreground">{position.data.club?.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{position.data.description}</p>
            </div>
            <div>
              <h3 className="font-medium">Requirements</h3>
              <p className="text-muted-foreground">{position.data.requirements}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ApplyForm position={position.data} />
    </div>
  );
};

export default ApplicationDetails;
