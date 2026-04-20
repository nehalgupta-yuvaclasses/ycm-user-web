import * as React from 'react';
import { Star, Users, ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/features/courses/types';
import { useAuthModal } from '@/contexts/AuthContext';

export interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const { openAuthModal, user } = useAuthModal();

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      navigate('/dashboard/courses');
    } else {
      openAuthModal();
    }
  };

  const handleCardClick = () => {
    navigate(`/course/${course.id}`);
  };

  const currentPrice = course.selling_price;
  const originalPrice = course.buying_price > course.selling_price ? course.buying_price : null;
  
  const discount = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : null;

  return (
    <Card 
      onClick={handleCardClick}
      className="group flex flex-col h-full overflow-hidden border-zinc-100 bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-zinc-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl">
            <PlayCircle className="w-8 h-8 text-zinc-900" />
          </div>
        </div>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {course.students_count > 1000 && (
            <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-400 border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Bestseller
            </Badge>
          )}
          {new Date(course.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 && (
            <Badge className="bg-blue-500 text-white hover:bg-blue-500 border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              New
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-0.5 rounded">
            Online Course
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold leading-none">4.9</span>
          </div>
        </div>
        
        <h3 className="text-base font-semibold text-zinc-900 mb-2 line-clamp-2 leading-snug group-hover:text-zinc-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-zinc-500 mb-4 font-medium flex items-center gap-1.5">
          <span className="text-zinc-400">by</span> {course.author || 'Yuva Classes'}
        </p>

        <div className="mt-auto flex items-center gap-3 text-zinc-500 text-xs">
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md">
            <Users className="w-3.5 h-3.5" />
            <span className="font-semibold">{course.students_count.toLocaleString()} Students Enrolled</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-zinc-50 mt-4">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-zinc-900">₹{currentPrice}</span>
            {originalPrice && (
              <span className="text-xs text-zinc-400 line-through font-medium">₹{originalPrice}</span>
            )}
          </div>
          {discount && discount > 0 && (
            <span className="text-[10px] font-bold text-emerald-600">
              Save {discount}% off
            </span>
          )}
        </div>
        <Button 
          onClick={handleEnrollClick}
          className="bg-zinc-900 text-white hover:bg-zinc-800 h-11 px-5 rounded-xl font-bold gap-2 transition-all"
        >
          Enroll Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
