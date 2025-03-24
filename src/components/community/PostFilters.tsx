
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PostFiltersProps {
  activeFilter: string;
  searchTerm: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({ 
  activeFilter, 
  searchTerm, 
  onFilterChange, 
  onSearchChange 
}) => {
  const filters = [
    { value: 'all', label: 'All Posts' },
    { value: 'following', label: 'Following' },
    { value: 'events', label: 'Events' },
    { value: 'announcements', label: 'Announcements' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(filter => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className="whitespace-nowrap"
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PostFilters;
