
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { X } from "lucide-react";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to format date time
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

// Function to format date
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
}

// Function to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Format as a date
  return formatDate(date);
}

// Function to truncate text with ellipsis
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Function to get initials from a name
export function getInitials(name: string | null | undefined): string {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(part => part && part[0] ? part[0].toUpperCase() : '')
    .join('')
    .slice(0, 2);
}

// Function to create notification message for flagged posts
export function createFlagNotificationMessage(postTitle: string, flaggerName: string): string {
  return `Your post "${truncateText(postTitle, 30)}" has been flagged by ${flaggerName} for review.`;
}

// Function to check if an image URL is valid
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  // Check if URL has an image extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext)) || 
         url.startsWith('data:image/');
}
