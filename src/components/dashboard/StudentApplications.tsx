
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getUserApplications } from '@/lib/mongodb/services/recruitmentService';
import { useAuth } from '@/contexts/AuthContext';

const StudentApplications = () => {
  const { user } = useAuth();
  
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => getUserApplications(user?.id || ''),
    enabled: !!user?.id
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications?.data?.length ? (
            applications.data.map((application: any) => (
              <div key={application.id} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium">{application.recruitment_id.title}</h3>
                  <p className="text-sm text-muted-foreground">{application.recruitment_id.club_id.name}</p>
                </div>
                <Badge variant={application.status === 'accepted' ? 'success' : 
                              application.status === 'rejected' ? 'destructive' : 
                              'secondary'}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No applications submitted yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentApplications;
