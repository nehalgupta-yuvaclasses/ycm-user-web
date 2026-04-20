import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCourse, useCourseCurriculum } from '@/features/courses/hooks';
import { 
  Clock, 
  Globe, 
  Video, 
  Calendar, 
  Check, 
  ChevronDown, 
  Lock, 
  Play, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Info,
  Loader2
} from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthContext';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openAuthModal, user } = useAuthModal();
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const { data: course, isLoading: isLoadingCourse, isError: isErrorCourse } = useCourse(id || '');
  const { data: curriculum, isLoading: isLoadingCurriculum } = useCourseCurriculum(id || '');
  const requestedLectureId = searchParams.get('lecture');

  const lectureTarget = useMemo(() => {
    if (!requestedLectureId || !curriculum) {
      return null;
    }

    for (const subject of curriculum as any[]) {
      for (const module of subject?.modules || []) {
        const lecture = module?.lessons?.find((entry: any) => entry.id === requestedLectureId);
        if (lecture) {
          return { subjectId: subject.id as string, moduleId: module.id as string, lectureId: lecture.id as string };
        }
      }
    }

    return null;
  }, [curriculum, requestedLectureId]);

  useEffect(() => {
    if (!lectureTarget?.moduleId || !lectureTarget.subjectId) {
      return;
    }

    setExpandedSubjects((current) => (current.includes(lectureTarget.subjectId) ? current : [...current, lectureTarget.subjectId]));
    setExpandedModules((current) => (current.includes(lectureTarget.moduleId) ? current : [...current, lectureTarget.moduleId]));

    const timer = window.setTimeout(() => {
      const element = document.getElementById(`lesson-${lectureTarget.lectureId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [lectureTarget]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((current) =>
      current.includes(subjectId) ? current.filter((entry) => entry !== subjectId) : [...current, subjectId]
    );
  };

  const toggleModule = (id: string) => {
    setExpandedModules((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  };

  const handleEnrollClick = () => {
    if (user) {
      navigate(`/checkout/${course.id}`);
    } else {
      openAuthModal();
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  if (isErrorCourse || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <Info className="w-12 h-12 text-zinc-300 mb-4" />
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Course not found</h1>
        <p className="text-zinc-500 mb-8">The course you are looking for might have been removed or is currently unavailable.</p>
        <button 
          onClick={() => navigate('/courses')}
          className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const currentPrice = course.selling_price;
  const originalPrice = course.buying_price > course.selling_price ? course.buying_price : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null;

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-0">
      {/* 1. Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-zinc-50 border-b border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-2/3 space-y-6">
              {course.students_count > 1000 && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Best Seller
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
                {course.description || "A comprehensive roadmap designed to help you master every subject and secure your selection in the first attempt."}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center">
                  {course.author ? (
                    <span className="text-zinc-500 font-bold">{course.author[0]}</span>
                  ) : (
                    <Globe className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{course.author || "Yuva Classes"}</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Lead Instructor</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 md:hidden">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-zinc-900">₹{currentPrice}</span>
                  {originalPrice && (
                    <span className="text-sm text-zinc-400 line-through font-medium">₹{originalPrice} ({discount}% OFF)</span>
                  )}
                </div>
                <button 
                  onClick={handleEnrollClick}
                  className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                >
                  Enroll Now
                </button>
              </div>
            </div>

            {/* Desktop Price Box */}
            <div className="hidden lg:block lg:w-1/3 sticky top-32">
              <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50 space-y-6">
                <div className="aspect-video bg-zinc-100 rounded-2xl overflow-hidden relative group cursor-pointer">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                      <Play className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-zinc-900 fill-zinc-900" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-zinc-900">₹{currentPrice}</span>
                    {originalPrice && (
                      <span className="text-lg text-zinc-400 line-through font-medium">₹{originalPrice}</span>
                    )}
                  </div>
                  {discount && discount > 0 && (
                    <p className="text-sm text-green-600 font-bold">{discount}% Limited Time Discount</p>
                  )}
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={handleEnrollClick}
                    className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all"
                  >
                    Enroll Now
                  </button>
                  <button className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-bold text-lg hover:bg-zinc-50 transition-all">
                    Watch Preview
                  </button>
                </div>
                <p className="text-center text-xs text-zinc-400 font-medium">12 Months Validity • 100% Secure Payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="lg:w-2/3 space-y-16">
          
          {/* 2. Course Highlights */}
          <section className="flex flex-wrap gap-y-4 gap-x-8 border-b border-zinc-100 pb-12">
            <div className="flex items-center gap-2 text-zinc-600">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-bold">200+ Hours</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Globe className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-bold">Hinglish</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Video className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-bold">Live + Recorded</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-bold">1 Year Validity</span>
            </div>
          </section>

          {/* 3. What You Will Learn */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">What you will learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Complete syllabus coverage for competitive exams",
                "Advanced shortcut tricks for Mathematics",
                "Logical reasoning and mental ability mastery",
                "Daily current affairs and static GK updates",
                "Time management strategies for the actual exam",
                "Previous 10 years question paper analysis",
                "Personalized doubt clearing sessions",
                "Weekly mock tests with detailed analytics"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-zinc-900" />
                  </div>
                  <span className="text-zinc-600 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Course Curriculum */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Course Curriculum</h2>
            <div className="space-y-4">
              {isLoadingCurriculum ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-zinc-50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : curriculum && curriculum.length > 0 ? (
                curriculum.map((subject: any, subjectIndex: number) => (
                  <div key={subject.id} className="border border-zinc-100 rounded-2xl overflow-hidden bg-white">
                    <button
                      onClick={() => toggleSubject(subject.id)}
                      className="w-full flex items-center justify-between p-6 bg-zinc-50 hover:bg-zinc-100/50 transition-colors text-left"
                    >
                      <div>
                        <span className="font-bold text-zinc-900">{subject.name}</span>
                        <p className="text-xs text-zinc-400 font-medium mt-1">
                          Subject {subjectIndex + 1} · {subject.modules?.length || 0} modules
                        </p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${expandedSubjects.includes(subject.id) ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {expandedSubjects.includes(subject.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-3 space-y-3">
                            {subject.modules && subject.modules.length > 0 ? (
                              subject.modules.map((module: any, moduleIndex: number) => (
                                <div key={module.id} className="border border-zinc-100 rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between p-5 bg-white hover:bg-zinc-50 transition-colors text-left"
                                  >
                                    <div>
                                      <span className="font-semibold text-zinc-900">{module.title}</span>
                                      <p className="text-xs text-zinc-400 font-medium mt-1">
                                        Module {moduleIndex + 1} · {module.lessons?.length || 0} lessons
                                      </p>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${expandedModules.includes(module.id) ? 'rotate-180' : ''}`} />
                                  </button>

                                  <AnimatePresence>
                                    {expandedModules.includes(module.id) && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <div className="p-2 space-y-1 bg-zinc-50/40">
                                          {module.lessons && module.lessons.length > 0 ? (
                                            module.lessons.map((lesson: any) => (
                                              <div
                                                key={lesson.id}
                                                id={`lesson-${lesson.id}`}
                                                className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-colors group scroll-mt-24"
                                              >
                                                <div className="flex items-center gap-4">
                                                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                                    {lesson.lesson_type === 'recorded' ? <Play className="w-3 h-3 fill-current" /> : <Video className="w-3 h-3" />}
                                                  </div>
                                                  <div>
                                                    <p className="text-sm font-medium text-zinc-900">{lesson.title}</p>
                                                    <p className="text-xs text-zinc-400 font-medium">{lesson.duration || 'Live Session'}</p>
                                                  </div>
                                                </div>
                                                <Lock className="w-3 h-3 text-zinc-300" />
                                              </div>
                                            ))
                                          ) : (
                                            <div className="p-4 text-center text-sm text-zinc-400">
                                              No lessons in this module yet.
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-sm text-zinc-400">
                                No modules in this subject yet.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-500">
                  <p>Curriculum is being updated. Check back soon!</p>
                </div>
              )}
            </div>
          </section>

          {/* 5. Instructor Section */}
          <section className="p-8 md:p-12 bg-zinc-900 rounded-[2.5rem] text-white flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden flex-shrink-0 bg-zinc-800 flex items-center justify-center">
               <Globe className="w-12 h-12 text-zinc-700" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-bold">{course.author || "Yuva Classes Team"}</h3>
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Expert Educators</p>
              </div>
              <p className="text-zinc-300 leading-relaxed max-w-xl">
                Our faculty consists of experienced mentors who have helped thousands of aspirants secure their dream government jobs through structured and logical teaching methodologies.
              </p>
            </div>
          </section>

          {/* 6. FAQ Section */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {
                  question: "What is the validity of this course?",
                  answer: "The course comes with a validity of 12 months from the date of purchase. You can watch the lectures as many times as you want during this period."
                },
                {
                  question: "In which language will the classes be conducted?",
                  answer: "The primary language of instruction is Hinglish (a mix of Hindi and English) to ensure clarity for students across India."
                },
                {
                  question: "Can I access the course on my mobile?",
                  answer: "Yes, you can access the course on both our website and mobile application. Your progress will be synced across all devices."
                }
              ].map((faq, i) => (
                <div key={i} className="border-b border-zinc-100">
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className="font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="pb-6 text-zinc-500 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* 8. Sticky CTA (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 p-4 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-zinc-900">₹{currentPrice}</p>
            {discount && <p className="text-xs text-green-600 font-bold">{discount}% OFF</p>}
          </div>
          <button 
            onClick={handleEnrollClick}
            className="flex-1 py-4 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            Enroll Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="bg-zinc-50 py-12 border-t border-zinc-100">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Secure Learning Environment</span>
          </div>
          <p className="text-xs text-zinc-400 text-center max-w-md">
            All payments are processed through encrypted gateways. Your data and privacy are our top priority.
          </p>
        </div>
      </div>
    </div>
  );
}

