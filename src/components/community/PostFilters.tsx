
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { Search, X } from 'lucide-react';

interface PostFiltersProps {
  filters: {
    search: string;
    postType: string;
    author: string;
    tags: string[];
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  userRole: 'student' | 'clubRepresentative' | 'admin';
}

const PostFilters: React.FC<PostFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  userRole
}) => {
  const availableTags = [
    'Event', 'Announcement', 'Achievement', 'Job', 'Community', 'Academic',
    'Competition', 'Workshop', 'Social', 'Volunteer'
  ];

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="font-medium dark:text-white">Filters</h3>
        <button 
          onClick={onClearFilters}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <X size={14} /> Clear all
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search posts..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-8 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        {/* Post Type */}
        <div>
          <label className="text-sm font-medium mb-1.5 block dark:text-gray-300">Post Type</label>
          <Select
            value={filters.postType}
            onValueChange={(value) => onFilterChange('postType', value)}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="job">Job Opening</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="general">General</SelectItem>
              {userRole === 'admin' && (
                <SelectItem value="flagged">Flagged</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Author Type */}
        <div>
          <label className="text-sm font-medium mb-1.5 block dark:text-gray-300">Posted By</label>
          <Select
            value={filters.author}
            onValueChange={(value) => onFilterChange('author', value)}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All users</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="clubs">Clubs</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              {userRole === 'student' && (
                <SelectItem value="following">Following</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tags */}
        <div>
          <label className="text-sm font-medium mb-1.5 block dark:text-gray-300">Tags</label>
          <div className="flex flex-wrap gap-2 mt-2">
            <ToggleGroup 
              type="multiple" 
              className="flex flex-wrap gap-2"
              value={filters.tags}
              onValueChange={(value) => onFilterChange('tags', value)}
            >
              {availableTags.map(tag => (
                <ToggleGroupItem 
                  key={tag} 
                  value={tag.toLowerCase()}
                  className="px-2 py-1 text-xs rounded-full data-[state=on]:bg-cluby-100 data-[state=on]:text-cluby-700 dark:data-[state=on]:bg-cluby-900/50 dark:data-[state=on]:text-cluby-400"
                >
                  {tag}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        
        {/* Selected Filters */}
        {(filters.search || filters.postType || filters.author || filters.tags.length > 0) && (
          <div className="pt-2 border-t dark:border-gray-700">
            <p className="text-sm text-muted-foreground mb-2 dark:text-gray-400">Active filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="outline" className="flex gap-1 items-center bg-background">
                  Search: {filters.search}
                  <X 
                    size={14} 
                    className="cursor-pointer" 
                    onClick={() => onFilterChange('search', '')}
                  />
                </Badge>
              )}
              
              {filters.postType && (
                <Badge variant="outline" className="flex gap-1 items-center bg-background">
                  Type: {filters.postType}
                  <X 
                    size={14} 
                    className="cursor-pointer" 
                    onClick={() => onFilterChange('postType', '')}
                  />
                </Badge>
              )}
              
              {filters.author && (
                <Badge variant="outline" className="flex gap-1 items-center bg-background">
                  By: {filters.author}
                  <X 
                    size={14} 
                    className="cursor-pointer" 
                    onClick={() => onFilterChange('author', '')}
                  />
                </Badge>
              )}
              
              {filters.tags.map(tag => (
                <Badge key={tag} variant="outline" className="flex gap-1 items-center bg-background">
                  {tag}
                  <X 
                    size={14} 
                    className="cursor-pointer" 
                    onClick={() => onFilterChange('tags', filters.tags.filter(t => t !== tag))}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFilters;
