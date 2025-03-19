
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const PostNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-6">
        <div className="bg-gray-100 rounded-full p-6 inline-block">
          <FileText className="h-12 w-12 text-cluby-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">Post Not Found</h2>
        <p className="text-gray-600 max-w-md">
          The post you're looking for might have been deleted or doesn't exist.
          Return to the community feed to see the latest posts.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Button asChild>
            <Link to="/community">Community Feed</Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to={-1 as any}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostNotFound;
