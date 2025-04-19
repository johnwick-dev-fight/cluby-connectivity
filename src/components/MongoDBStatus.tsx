
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw, Database, Server, AlertTriangle } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch('/api/mongodb-status');
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Clone the response before parsing it to avoid "body stream already read" error
      const responseClone = response.clone();
      let data: MongoDBStatusResponse;
      
      try {
        data = await responseClone.json();
      } catch (parseError) {
        // Handle JSON parsing error
        const text = await response.text();
        console.error("Failed to parse JSON response:", text);
        throw new Error(`Invalid response format: ${text.substring(0, 100)}...`);
      }
      
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
      console.error("Error fetching MongoDB status:", error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      
      setStatus({
        success: false,
        connected: false,
        message: 'Error checking MongoDB connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        variant: "destructive",
        title: "Error Checking MongoDB Status",
        description: error instanceof Error ? error.message : 'Failed to check connection status',
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
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {status.error}
                </AlertDescription>
              </Alert>
            )}
            
            {errorMessage && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errorMessage}
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
