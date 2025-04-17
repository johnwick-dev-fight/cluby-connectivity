
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw, Database, Server } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MongoDBStatusResponse {
  success: boolean;
  connected: boolean;
  message: string;
  error?: string;
  details?: {
    username?: string;
    cluster?: string;
    dbName?: string;
    uri?: string;
  };
}

const MongoDBStatus = () => {
  const [status, setStatus] = useState<MongoDBStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mongodb-status');
      const data = await response.json();
      setStatus(data);
      
      if (data.connected) {
        toast({
          title: "MongoDB Connected",
          description: "Your application is successfully connected to MongoDB Atlas",
        });
      } else {
        toast({
          variant: "destructive",
          title: "MongoDB Connection Failed",
          description: data.message || "Could not connect to MongoDB",
        });
      }
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
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          MongoDB Connection Status
        </CardTitle>
        <CardDescription>
          Check if the application can connect to MongoDB Atlas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status ? (
          <div className="flex flex-col gap-3">
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
              <Alert variant="destructive" className="mt-2">
                <AlertDescription className="text-sm">
                  {status.error}
                </AlertDescription>
              </Alert>
            )}
            
            {status.details && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1"
                >
                  <Server className="h-4 w-4" />
                  {showDetails ? 'Hide Details' : 'Show Connection Details'}
                </Button>
                
                {showDetails && (
                  <div className="mt-3 text-sm space-y-1 bg-muted p-3 rounded-md">
                    <p><span className="font-medium">Cluster:</span> {status.details.cluster}</p>
                    <p><span className="font-medium">Database:</span> {status.details.dbName}</p>
                    <p><span className="font-medium">URI:</span> {status.details.uri}</p>
                  </div>
                )}
              </div>
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
