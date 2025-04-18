
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminClubApprovals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Club Approvals</h1>
        <p className="text-muted-foreground">Review and approve club registration requests</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Club approval functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClubApprovals;
