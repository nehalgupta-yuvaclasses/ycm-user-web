import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCourse, useCourseCurriculum, useCourseEnrollment } from '@/features/courses/hooks';
import {
  Clock,
  Globe,
  Video,
  Calendar,
  Check,
  ChevronDown,
  Lock,
  Play,
  ArrowRight,
  ShieldCheck,
  Info,
  Loader2,
} from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthContext';

function isLiveLesson(lesson: any) {
  return Boolean(lesson?.is_live || (lesson?.lesson_type === 'live' && !lesson?.live_ended_at));
}

function isEndedLiveLesson(lesson: any) {
  return Boolean(lesson?.lesson_type === 'live' && !isLiveLesson(lesson) && lesson?.live_ended_at);
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function isRecordedLessonReady(lesson: any) {
  return Boolean(
    lesson?.can_play ||
    lesson?.is_recorded_ready ||
    (lesson?.lesson_type === 'recorded' && (lesson?.youtube_recording_url || lesson?.video_url))
  );
}

function canPlayLesson(lesson: any) {
  return Boolean(lesson?.can_play ?? (isLiveLesson(lesson) || isRecordedLessonReady(lesson)));
}

function resolveYouTubeEmbedUrl(rawUrl?: string | null) {
  if (!rawUrl) {
    return '';
  }

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : rawUrl;
    }

    if (host.endsWith('youtube.com')) {
      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) {
        return `https://www.youtube.com/embed/${embedMatch[1]}?rel=0&modestbranding=1`;
      }

      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }

      const liveMatch = parsed.pathname.match(/\/live\/([^/?]+)/);
      if (liveMatch?.[1]) {
        return `https://www.youtube.com/embed/${liveMatch[1]}?rel=0&modestbranding=1`;
      }
    }
  } catch {
    return rawUrl;
  }

  return rawUrl;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openAuthModal, user } = useAuthModal();
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const { data: course, isLoading: isLoadingCourse, isError: isErrorCourse } = useCourse(id || '');
  const { data: curriculum, isLoading: isLoadingCurriculum } = useCourseCurriculum(id || '');
  const { data: enrollment } = useCourseEnrollment(id || '', user?.firebaseUid ?? null, user?.studentId ?? null);
  const isEnrolled = Boolean(enrollment);
  const requestedLectureId = searchParams.get('lecture');

  const curriculumSummary = useMemo(() => {
    const summary = {
      subjects: curriculum?.length || 0,
      modules: 0,
      lessons: 0,
      liveLessons: 0,
      recordedLessons: 0,
    };

    for (const subject of curriculum || []) {
      summary.modules += subject?.modules?.length || 0;

      for (const module of subject?.modules || []) {
        for (const lesson of module?.lessons || []) {
          summary.lessons += 1;
          if (lesson?.lesson_type === 'live') {
            summary.liveLessons += 1;
          } else {
            summary.recordedLessons += 1;
          }
        }
      }
    }

    return summary;
  }, [curriculum]);

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

  const activeLesson = useMemo(() => {
    if (!curriculum) {
      return null;
    }

    for (const subject of curriculum as any[]) {
      for (const module of subject?.modules || []) {
        const lesson = module?.lessons?.find((entry: any) => entry.id === (activeLessonId || requestedLectureId));
        if (lesson) {
          return lesson;
        }
      }
    }

    for (const subject of curriculum as any[]) {
      for (const module of subject?.modules || []) {
        const lesson = module?.lessons?.find((entry: any) => canPlayLesson(entry));
        if (lesson) {
          return lesson;
        }
      }
    }

    return null;
  }, [activeLessonId, curriculum, requestedLectureId]);

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

  useEffect(() => {
    if (!isEnrolled || activeLessonId || !curriculum) {
      return;
    }

    for (const subject of curriculum as any[]) {
      for (const module of subject?.modules || []) {
        const lesson = module?.lessons?.find((entry: any) => canPlayLesson(entry));
        if (lesson) {
          setActiveLessonId(lesson.id);
          return;
        }
      }
    }
  }, [activeLessonId, curriculum, isEnrolled]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((current) =>
      current.includes(subjectId) ? current.filter((entry) => entry !== subjectId) : [...current, subjectId]
    );
  };

  const toggleModule = (id: string) => {
    setExpandedModules((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  };

  const handleEnrollClick = () => {
    if (isEnrolled) {
      document.getElementById('lesson-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (user) {
      navigate(`/checkout/${course.id}`);
    } else {
      openAuthModal();
    }
  };

  const handleSelectLesson = (lesson: any) => {
    if (!isEnrolled || !canPlayLesson(lesson)) {
      return;
    }

    setActiveLessonId(lesson.id);
    window.setTimeout(() => {
      document.getElementById('lesson-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  if (isLoadingCourse) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  if (isErrorCourse || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-4 text-center">
        <Info className="h-12 w-12 text-zinc-300" />
        <h1 className="text-2xl font-semibold text-zinc-950">Course not found</h1>
        <p className="max-w-md text-sm text-zinc-500">The course you are looking for might have been removed or is currently unavailable.</p>
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Back to courses
        </button>
      </div>
    );
  }

  const currentPrice = course.selling_price;
  const originalPrice = course.buying_price > course.selling_price ? course.buying_price : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null;
  const courseFacts = [
    { label: 'Students enrolled', value: formatCount(course.students_count) },
    { label: 'Curriculum', value: `${formatCount(curriculumSummary.subjects)} subjects` },
    { label: 'Format', value: curriculumSummary.liveLessons > 0 ? 'Live and recorded' : 'Recorded' },
    { label: 'Access', value: isEnrolled ? 'Unlocked' : 'Buy to unlock' },
  ];

  const learningPoints = [
    'Structured subject-by-subject learning path',
    'Live classes with recorded backup for revision',
    'Clear module flow with lessons grouped in order',
    'Built for consistent daily study and mock practice',
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcfcfb_0%,#f6f4ef_100%)] pb-20 text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to courses
          </button>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {isEnrolled ? 'Course unlocked' : 'Secure checkout after enrollment'}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_380px] lg:items-start">
          <main className="space-y-8">
            <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                <span>Course detail</span>
                <span className="text-zinc-300">/</span>
                <span>{course.author || 'Yuva Classes'}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">{course.title}</h1>
                <p className="max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
                  {course.description || 'A structured course built to keep the learning path clear, the lesson flow organized, and revision easy to follow.'}
                </p>
              </div>

              <div className="flex flex-col gap-4 border-y border-zinc-200 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-500">
                    {course.author ? <span className="text-sm font-semibold text-zinc-700">{course.author[0]}</span> : <Globe className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{course.author || 'Yuva Classes Team'}</p>
                    <p className="text-sm text-zinc-500">Instructor</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold tracking-tight text-zinc-950">₹{formatCount(currentPrice)}</span>
                  {originalPrice ? <span className="text-sm text-zinc-400 line-through">₹{formatCount(originalPrice)}</span> : null}
                  {discount && discount > 0 ? <span className="text-sm font-medium text-emerald-700">{discount}% off</span> : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {courseFacts.map((item) => (
                  <div key={item.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">{item.label}</p>
                    <p className="mt-1 text-base font-medium text-zinc-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Clock, title: 'Study at a steady pace', text: 'Content stays organized so you can revise without searching through scattered lectures.' },
                { icon: Video, title: 'Live and recorded lessons', text: 'Live classes are paired with recordings where available, so revision never depends on one session.' },
                { icon: Calendar, title: 'Built for long-term access', text: 'The course is designed around a fixed access window that supports full preparation cycles.' },
                { icon: Check, title: 'Clear lesson order', text: 'Subjects, modules, and lessons stay nested in the same structure used by the curriculum.' },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-base font-medium text-zinc-950">{item.title}</h2>
                        <p className="text-sm leading-6 text-zinc-600">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">What this course covers</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">A clean overview of the learning experience and the structure behind it.</p>
                </div>
                <div className="hidden rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 md:block">
                  {formatCount(curriculumSummary.subjects)} subjects · {formatCount(curriculumSummary.modules)} modules · {formatCount(curriculumSummary.lessons)} lessons
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {learningPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white">
                      <Check className="h-3 w-3 text-zinc-900" />
                    </div>
                    <p className="text-sm leading-6 text-zinc-700">{item}</p>
                  </div>
                ))}
              </div>

              <section id="lesson-player" className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                      {activeLesson?.lesson_type === 'live' ? 'Live class' : 'Recorded lesson'}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {activeLesson?.lesson_type === 'live'
                        ? 'The live session is embedded here and updates with lesson state changes.'
                        : 'Recorded playback appears here once the lesson is marked ready.'}
                    </p>
                  </div>
                  {isEnrolled && activeLesson ? (
                    <div className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                      {isLiveLesson(activeLesson) ? 'LIVE' : 'RECORDED READY'}
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950">
                  {isEnrolled && activeLesson ? (
                    <iframe
                      title={activeLesson.title}
                      className="aspect-video w-full"
                      src={resolveYouTubeEmbedUrl(activeLesson.youtube_live_url || activeLesson.live_url || activeLesson.youtube_recording_url || activeLesson.video_url)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-zinc-300">
                      {isEnrolled ? 'Select a live class or a ready recording to start watching.' : 'Enroll to unlock the lesson player.'}
                    </div>
                  )}
                </div>
              </section>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Course structure</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">Subjects expand into modules, and modules expand into lessons in reading order.</p>
                </div>
                <p className="text-sm text-zinc-500">
                  {curriculumSummary.liveLessons} live · {curriculumSummary.recordedLessons} recorded
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {isLoadingCurriculum ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="h-20 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50" />
                    ))}
                  </div>
                ) : curriculum && curriculum.length > 0 ? (
                  curriculum.map((subject: any, subjectIndex: number) => {
                    const subjectLessonCount = (subject.modules || []).reduce((total: number, module: any) => total + (module.lessons?.length || 0), 0);

                    return (
                      <div key={subject.id} className="overflow-hidden rounded-xl border border-zinc-200">
                        <button
                          onClick={() => toggleSubject(subject.id)}
                          className="flex w-full items-center justify-between gap-4 bg-zinc-50 px-5 py-4 text-left transition-colors hover:bg-zinc-100/70"
                        >
                          <div className="min-w-0">
                            <p className="text-base font-medium text-zinc-950">{subject.name}</p>
                            <p className="mt-1 text-sm text-zinc-500">
                              Subject {subjectIndex + 1} · {formatCount(subject.modules?.length || 0)} modules · {formatCount(subjectLessonCount)} lessons
                            </p>
                          </div>
                          <ChevronDown className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 ${expandedSubjects.includes(subject.id) ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {expandedSubjects.includes(subject.id) ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="border-t border-zinc-200 bg-white p-4 sm:p-5">
                                {subject.modules && subject.modules.length > 0 ? (
                                  <div className="space-y-3">
                                    {subject.modules.map((module: any, moduleIndex: number) => {
                                      const moduleLessonCount = module.lessons?.length || 0;

                                      return (
                                        <div key={module.id} className="overflow-hidden rounded-xl border border-zinc-200">
                                          <button
                                            onClick={() => toggleModule(module.id)}
                                            className="flex w-full items-center justify-between gap-4 bg-white px-4 py-4 text-left transition-colors hover:bg-zinc-50"
                                          >
                                            <div className="min-w-0">
                                              <p className="text-sm font-medium text-zinc-950">{module.title}</p>
                                              <p className="mt-1 text-xs text-zinc-500">
                                                Module {moduleIndex + 1} · {formatCount(moduleLessonCount)} lessons
                                              </p>
                                            </div>
                                            <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${expandedModules.includes(module.id) ? 'rotate-180' : ''}`} />
                                          </button>

                                          <AnimatePresence>
                                            {expandedModules.includes(module.id) ? (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                              >
                                                <div className="border-t border-zinc-200 bg-zinc-50/60 p-3">
                                                  {module.lessons && module.lessons.length > 0 ? (
                                                    <div className="space-y-2">
                                                      {module.lessons.map((lesson: any) => (
                                                        <div
                                                          key={lesson.id}
                                                          id={`lesson-${lesson.id}`}
                                                          className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 scroll-mt-24"
                                                        >
                                                          <div className="flex min-w-0 items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                                                              {lesson.lesson_type === 'recorded' ? <Play className="h-3.5 w-3.5 fill-current" /> : <Video className="h-3.5 w-3.5" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                              <div className="flex flex-wrap items-center gap-2">
                                                                <p className="truncate text-sm font-medium text-zinc-950">{lesson.title}</p>
                                                                {isLiveLesson(lesson) ? (
                                                                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                                                    Live
                                                                  </span>
                                                                ) : null}
                                                                {isEndedLiveLesson(lesson) ? (
                                                                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                                                                    Ended
                                                                  </span>
                                                                ) : null}
                                                              </div>
                                                              <p className="mt-1 text-xs text-zinc-500">
                                                                {lesson.duration || (lesson.lesson_type === 'live' ? 'Live session' : 'Recorded lesson')}
                                                              </p>
                                                            </div>
                                                          </div>

                                                          <div className="flex shrink-0 items-center gap-3">
                                                            {isEnrolled && canPlayLesson(lesson) ? (
                                                              <button
                                                                onClick={() => handleSelectLesson(lesson)}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-900 hover:text-white"
                                                              >
                                                                {isLiveLesson(lesson) ? 'Watch live' : 'Watch recording'}
                                                              </button>
                                                            ) : (
                                                              <Lock className="h-3.5 w-3.5 text-zinc-300" />
                                                            )}
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  ) : (
                                                    <div className="rounded-lg border border-dashed border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
                                                      No lessons in this module yet.
                                                    </div>
                                                  )}
                                                </div>
                                              </motion.div>
                                            ) : null}
                                          </AnimatePresence>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
                                    No modules in this subject yet.
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
                    Curriculum is being updated. Check back soon.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-5 lg:grid-cols-[140px_minmax(0,1fr)] lg:items-start">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
                  {course.thumbnail_url ? <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" /> : <Globe className="h-10 w-10" />}
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Instructor</h2>
                  <p className="text-sm font-medium text-zinc-900">{course.author || 'Yuva Classes Team'}</p>
                  <p className="max-w-3xl text-sm leading-7 text-zinc-600">
                    The course is presented in a simple teaching flow so learners can move through topics in order, revise consistently, and return to specific lessons when needed.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Common questions</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">Quick answers for access, language, and device usage.</p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200">
                {[
                  {
                    question: 'What is the validity of this course?',
                    answer: 'The course comes with a validity of 12 months from the date of purchase. You can revisit the lectures during this period whenever you need revision.',
                  },
                  {
                    question: 'In which language will the classes be conducted?',
                    answer: 'The primary language of instruction is Hinglish, which keeps explanations clear for learners who prefer a mix of Hindi and English.',
                  },
                  {
                    question: 'Can I access the course on my mobile?',
                    answer: 'Yes. The course can be accessed on mobile and desktop, so you can continue studying wherever you are.',
                  },
                ].map((faq, index) => (
                  <div key={faq.question} className="bg-white first:rounded-t-xl last:rounded-b-xl">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50"
                    >
                      <span className="text-sm font-medium text-zinc-950">{faq.question}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${expandedFaq === index ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {expandedFaq === index ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-4 text-sm leading-7 text-zinc-600">{faq.answer}</div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="relative aspect-[16/10] border-b border-zinc-200 bg-zinc-100">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    <Play className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white text-zinc-900 shadow-sm">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="space-y-2">
                  <p className="text-sm text-zinc-500">Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-semibold tracking-tight text-zinc-950">₹{formatCount(currentPrice)}</span>
                    {originalPrice ? <span className="text-sm text-zinc-400 line-through">₹{formatCount(originalPrice)}</span> : null}
                  </div>
                  {discount && discount > 0 ? <p className="text-sm font-medium text-emerald-700">Save {discount}% compared to the original price</p> : null}
                </div>

                <button
                  onClick={handleEnrollClick}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  {isEnrolled ? 'Open course' : user ? 'Enroll now' : 'Sign in to enroll'}
                </button>

                <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Secure payment flow
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    12 months access
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-zinc-500" />
                    Live and recorded lessons
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>Subjects</span>
                    <span className="font-medium text-zinc-900">{formatCount(curriculumSummary.subjects)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
                    <span>Modules</span>
                    <span className="font-medium text-zinc-900">{formatCount(curriculumSummary.modules)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
                    <span>Lessons</span>
                    <span className="font-medium text-zinc-900">{formatCount(curriculumSummary.lessons)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:mt-6">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <p className="text-sm leading-6 text-zinc-600">
                  Need access help after purchase? Contact support with your order details and we will check the account state.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
