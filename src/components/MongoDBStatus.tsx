
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface MongoDBStatusResponse {
  success: boolean;
  connected: boolean;
  message: string;
  error?: string;
}

const MongoDBStatus = () => {
  const [status, setStatus] = useState<MongoDBStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mongodb-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        success: false,
        connected: false,
        message: 'Error checking MongoDB connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>MongoDB Connection Status</CardTitle>
        <CardDescription>
          Check if the application can connect to MongoDB
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              {status.connected ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span>Not Connected</span>
                </div>
              )}
            </div>
            <p className="text-sm">{status.message}</p>
            {status.error && (
              <p className="text-sm text-red-600 mt-2">{status.error}</p>
            )}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <p>Checking MongoDB connection...</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkConnection} 
          disabled={loading}
          className="flex gap-2 items-center"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          Refresh Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MongoDBStatus;
