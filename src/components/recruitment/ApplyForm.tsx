
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const applicationSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  resumeUrl: z.string().url('Please enter a valid URL').optional(),
});

const ApplyForm = ({ position }: { position: any }) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: z.infer<typeof applicationSchema>) => {
    try {
      // In a real app, this would submit to an API
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Tell us why you're interested in this position..."
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormDescription>
                Explain your interest in the position and relevant experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resumeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume URL (Optional)</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://your-resume.com" />
              </FormControl>
              <FormDescription>
                Link to your resume or portfolio
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplyForm;
