
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const RecruitmentNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-6">
        <div className="bg-gray-100 rounded-full p-6 inline-block">
          <Briefcase className="h-12 w-12 text-cluby-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">Position Not Found</h2>
        <p className="text-gray-600 max-w-md">
          This recruitment position might have been filled or removed.
          Check out other open positions that match your skills and interests.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Button asChild>
            <Link to="/recruit">Open Positions</Link>
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

export default RecruitmentNotFound;
