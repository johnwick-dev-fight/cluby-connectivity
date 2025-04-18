
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRecruitments } from '@/lib/mongodb/services/recruitmentService';
import { useAuth } from '@/contexts/AuthContext';

const CRPRecruitment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: positions, isLoading } = useQuery({
    queryKey: ['recruitments', user?.id],
    queryFn: () => getRecruitments({ club_id: user?.club_id }),
    enabled: !!user?.club_id
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recruitment Management</CardTitle>
        <Button onClick={() => navigate('/recruitment/create')}>
          Post New Position
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions?.data?.length ? (
            positions.data.map((position: any) => (
              <div key={position.id} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium">{position.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {position.applications?.length || 0} applications
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={position.status === 'closed' ? 'secondary' : 'default'}>
                    {position.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/recruitment/${position.id}/applications`)}
                  >
                    View Applications
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No positions posted yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CRPRecruitment;
