
import dbConnect from '../db';
import Recruitment from '../models/Recruitment';
import Application from '../models/Application';

// Mock data for client-side development
const MOCK_RECRUITMENTS = [
  {
    id: '1',
    title: 'Web Developer',
    description: 'Looking for experienced web developers to join our team',
    requirements: 'HTML, CSS, JavaScript, React experience required',
    club_id: '1',
    created_by: '1',
    positions_available: 2,
    application_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    club: {
      _id: '1',
      name: 'Programming Club',
      logo_url: '/avatar-placeholder.jpg'
    }
  },
  {
    id: '2',
    title: 'Photographer',
    description: 'Seeking photographers for our upcoming events',
    requirements: 'Experience with DSLR cameras and photo editing software',
    club_id: '2',
    created_by: '2',
    positions_available: 3,
    application_deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    club: {
      _id: '2',
      name: 'Photography Club',
      logo_url: '/avatar-placeholder.jpg'
    }
  }
];

// Mock applications data
const MOCK_APPLICATIONS = [
  {
    id: '1',
    recruitment_id: '1',
    applicant_id: '3',
    club_id: '1',
    cover_letter: 'I am interested in this position because...',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    applicant: {
      _id: '3',
      full_name: 'John Applicant',
      avatar_url: '/avatar-placeholder.jpg'
    }
  }
];

// Check if code is running on server or client
const isServer = typeof window === 'undefined';

export async function createRecruitment(recruitmentData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const newRecruitment = new Recruitment(recruitmentData);
      const savedRecruitment = await newRecruitment.save();
      return { data: savedRecruitment, error: null };
    } else {
      console.log('Mocking recruitment creation with data:', recruitmentData);
      return { 
        data: { id: `mock-${Date.now()}`, ...recruitmentData, created_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error creating recruitment:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getRecruitments(query: any = {}) {
  try {
    if (isServer) {
      await dbConnect();
      const recruitments = await Recruitment.find(query)
        .populate('club_id', 'name logo_url')
        .populate('created_by', 'full_name')
        .sort({ application_deadline: 1 });
        
      return { data: recruitments, error: null };
    } else {
      console.log('Fetching mock recruitments with query:', query);
      
      // Filter mock data based on the query
      let filteredRecruitments = [...MOCK_RECRUITMENTS];
      
      if (query.status) {
        filteredRecruitments = filteredRecruitments.filter(recruitment => recruitment.status === query.status);
      }
      
      if (query.club_id) {
        filteredRecruitments = filteredRecruitments.filter(recruitment => recruitment.club_id === query.club_id);
      }
      
      return { data: filteredRecruitments, error: null };
    }
  } catch (error) {
    console.error('Error fetching recruitments:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getRecruitmentById(recruitmentId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const recruitment = await Recruitment.findById(recruitmentId)
        .populate('club_id', 'name logo_url')
        .populate('created_by', 'full_name');
        
      if (!recruitment) {
        return { data: null, error: 'Recruitment not found' };
      }
      
      return { data: recruitment, error: null };
    } else {
      console.log('Fetching mock recruitment with ID:', recruitmentId);
      const recruitment = MOCK_RECRUITMENTS.find(r => r.id === recruitmentId);
      return { data: recruitment || null, error: recruitment ? null : 'Recruitment not found' };
    }
  } catch (error) {
    console.error('Error fetching recruitment:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateRecruitment(recruitmentId: string, recruitmentData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const updatedRecruitment = await Recruitment.findByIdAndUpdate(
        recruitmentId,
        { ...recruitmentData, updated_at: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedRecruitment) {
        return { data: null, error: 'Recruitment not found' };
      }
      
      return { data: updatedRecruitment, error: null };
    } else {
      console.log('Mocking recruitment update with ID:', recruitmentId, 'and data:', recruitmentData);
      return { 
        data: { id: recruitmentId, ...recruitmentData, updated_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error updating recruitment:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteRecruitment(recruitmentId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const deletedRecruitment = await Recruitment.findByIdAndDelete(recruitmentId);
      
      if (!deletedRecruitment) {
        return { data: null, error: 'Recruitment not found' };
      }
      
      // Delete all applications associated with this recruitment
      await Application.deleteMany({ recruitment_id: recruitmentId });
      
      return { data: { id: recruitmentId, deleted: true }, error: null };
    } else {
      console.log('Mocking recruitment deletion with ID:', recruitmentId);
      return { data: { id: recruitmentId, deleted: true }, error: null };
    }
  } catch (error) {
    console.error('Error deleting recruitment:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function applyForRecruitment(applicationData: any) {
  try {
    if (isServer) {
      await dbConnect();
      
      // Check if user has already applied
      const existingApplication = await Application.findOne({
        recruitment_id: applicationData.recruitment_id,
        applicant_id: applicationData.applicant_id
      });
      
      if (existingApplication) {
        return { data: null, error: 'You have already applied for this position' };
      }
      
      const newApplication = new Application(applicationData);
      const savedApplication = await newApplication.save();
      return { data: savedApplication, error: null };
    } else {
      console.log('Mocking application creation with data:', applicationData);
      return { 
        data: { id: `mock-${Date.now()}`, ...applicationData, created_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error applying for recruitment:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getApplicationsForRecruitment(recruitmentId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const applications = await Application.find({ recruitment_id: recruitmentId })
        .populate('applicant_id', 'full_name avatar_url')
        .sort({ created_at: -1 });
        
      return { data: applications, error: null };
    } else {
      console.log('Fetching mock applications for recruitment ID:', recruitmentId);
      const filteredApplications = MOCK_APPLICATIONS.filter(app => app.recruitment_id === recruitmentId);
      return { data: filteredApplications, error: null };
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateApplicationStatus(applicationId: string, status: 'pending' | 'under_review' | 'accepted' | 'rejected') {
  try {
    if (isServer) {
      await dbConnect();
      const updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        { status, updated_at: new Date() },
        { new: true }
      );
      
      if (!updatedApplication) {
        return { data: null, error: 'Application not found' };
      }
      
      return { data: updatedApplication, error: null };
    } else {
      console.log('Mocking application status update with ID:', applicationId, 'to status:', status);
      return { 
        data: { id: applicationId, status, updated_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserApplications(userId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const applications = await Application.find({ applicant_id: userId })
        .populate({
          path: 'recruitment_id',
          populate: {
            path: 'club_id',
            select: 'name logo_url'
          }
        })
        .sort({ created_at: -1 });
        
      return { data: applications, error: null };
    } else {
      console.log('Fetching mock applications for user ID:', userId);
      const filteredApplications = MOCK_APPLICATIONS.filter(app => app.applicant_id === userId);
      return { data: filteredApplications, error: null };
    }
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
