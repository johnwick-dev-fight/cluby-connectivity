import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

const MOCK_POSITIONS = [
  {
    id: '1',
    title: 'Web Developer',
    club: 'Programming Club',
    clubId: '1',
    description: 'Looking for students skilled in React and Node.js to help maintain our club website and develop new features.',
    requirements: 'Experience with React, Node.js, and MongoDB',
    deadline: 'October 30, 2023',
    applicants: 5,
    tags: ['Technology', 'Web Development', 'Frontend', 'Backend']
  },
  {
    id: '2',
    title: 'Event Coordinator',
    club: 'Cultural Club',
    clubId: '3',
    description: 'Responsible for organizing and coordinating club events throughout the semester.',
    requirements: 'Good communication skills, event planning experience',
    deadline: 'October 25, 2023',
    applicants: 8,
    tags: ['Event Management', 'Communication', 'Planning']
  },
  {
    id: '3',
    title: 'Graphic Designer',
    club: 'Design Club',
    clubId: '4',
    description: 'Create visual content for club events, social media, and promotional materials.',
    requirements: 'Proficiency in Adobe Creative Suite, portfolio of work',
    deadline: 'November 5, 2023',
    applicants: 10,
    tags: ['Design', 'Creative', 'Adobe', 'Visual Arts']
  },
  {
    id: '4',
    title: 'Marketing Lead',
    club: 'Business Club',
    clubId: '5',
    description: 'Develop and implement marketing strategies to promote club events and increase membership.',
    requirements: 'Experience in digital marketing, social media management',
    deadline: 'November 10, 2023',
    applicants: 7,
    tags: ['Marketing', 'Social Media', 'Strategy', 'Business']
  },
  {
    id: '5',
    title: 'Technical Writer',
    club: 'Programming Club',
    clubId: '1',
    description: 'Document club projects, write tutorials, and create learning resources for members.',
    requirements: 'Strong writing skills, technical knowledge, attention to detail',
    deadline: 'October 28, 2023',
    applicants: 3,
    tags: ['Technical Writing', 'Documentation', 'Content Creation']
  }
];

const Recruitment = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [clubFilter, setClubFilter] = useState('all');
  
  const isCRP = user?.role === 'clubRepresentative';
  
  const filteredPositions = MOCK_POSITIONS.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          position.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          position.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          position.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                          
    const matchesClub = clubFilter === 'all' || position.clubId === clubFilter;
    
    return matchesSearch && matchesClub;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recruitment</h1>
          <p className="text-muted-foreground">Find open positions in campus clubs and organizations</p>
        </div>
        {isCRP && (
          <Button 
            className="self-end md:self-auto"
            onClick={() => navigate('/recruitment/create')}
          >
            Post a Position
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search positions, clubs, skills..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={clubFilter} onValueChange={setClubFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clubs</SelectItem>
              <SelectItem value="1">Programming Club</SelectItem>
              <SelectItem value="3">Cultural Club</SelectItem>
              <SelectItem value="4">Design Club</SelectItem>
              <SelectItem value="5">Business Club</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPositions.length > 0 ? (
          filteredPositions.map(position => (
            <Card key={position.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cluby-50 to-blue-50 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{position.title}</CardTitle>
                    <CardDescription className="text-foreground/70 font-medium mt-1">
                      {position.club}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white/80">
                    {position.applicants} Applicants
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-4">{position.description}</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold">Requirements:</h4>
                    <p className="text-sm text-muted-foreground">{position.requirements}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Deadline:</h4>
                    <p className="text-sm text-muted-foreground">{position.deadline}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {position.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button>Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 py-10 text-center text-muted-foreground">
            No positions found matching your criteria. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruitment;
