import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { fetchCourses, fetchFeaturedCourses, fetchCourseById, fetchCourseCurriculum, fetchCourseEnrollment } from './api';
import { CourseLesson, CourseSubject } from './types';

export function useCourses(sortBy: string = 'popular') {
  return useQuery({
    queryKey: ['courses', sortBy],
    queryFn: () => fetchCourses(sortBy),
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: fetchFeaturedCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => fetchCourseById(id),
    enabled: !!id,
  });
}

export function useCourseCurriculum(courseId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['courses', courseId, 'curriculum'],
    queryFn: () => fetchCourseCurriculum(courseId),
    enabled: !!courseId,
  });

  const moduleIdsKey = useMemo(() => {
    const moduleIds = new Set<string>();
    query.data?.forEach((subject) => {
      subject.modules.forEach((module) => {
        moduleIds.add(module.id);
      });
    });

    return Array.from(moduleIds).sort().join('|');
  }, [query.data]);

  useEffect(() => {
    if (!courseId || !moduleIdsKey) {
      return;
    }

    const moduleIdSet = new Set(moduleIdsKey.split('|').filter(Boolean));
    const queryKey = ['courses', courseId, 'curriculum'];

    const patchLesson = (subjects: CourseSubject[], lessonRow: Record<string, unknown>, eventType: string) => {
      const moduleId = String(lessonRow.module_id ?? '');
      if (!moduleIdSet.has(moduleId)) {
        return subjects;
      }

        const canPlay = Boolean(
          lessonRow.is_preview ??
          lessonRow.is_live ??
          lessonRow.is_recorded_ready ??
          lessonRow.youtube_live_url ??
          lessonRow.youtube_recording_url ??
          lessonRow.live_url ??
          lessonRow.video_url
        );

      const lesson: CourseLesson = {
        id: String(lessonRow.id ?? ''),
        module_id: moduleId,
        title: String(lessonRow.title ?? ''),
        lesson_type: lessonRow.lesson_type === 'live' ? 'live' : 'recorded',
        duration: lessonRow.duration == null ? null : String(lessonRow.duration),
        scheduled_at: lessonRow.scheduled_at == null ? null : String(lessonRow.scheduled_at),
        video_url: lessonRow.video_url == null ? null : String(lessonRow.video_url),
        youtube_live_url: lessonRow.youtube_live_url == null ? null : String(lessonRow.youtube_live_url),
        youtube_recording_url: lessonRow.youtube_recording_url == null ? null : String(lessonRow.youtube_recording_url),
        live_url: lessonRow.live_url == null ? null : String(lessonRow.live_url),
        notes: lessonRow.notes == null ? null : String(lessonRow.notes),
        is_live: Boolean(lessonRow.is_live),
        is_preview: Boolean(lessonRow.is_preview),
        is_recorded_ready: Boolean(lessonRow.is_recorded_ready),
        can_play: canPlay,
        live_started_at: lessonRow.live_started_at == null ? null : String(lessonRow.live_started_at),
        live_ended_at: lessonRow.live_ended_at == null ? null : String(lessonRow.live_ended_at),
        live_by: lessonRow.live_by == null ? null : String(lessonRow.live_by),
        order: Number(lessonRow.order ?? 0),
      };

      if (eventType === 'DELETE') {
        return subjects
          .map((subject) => ({
            ...subject,
            modules: subject.modules.map((module) => ({
              ...module,
              lessons: module.id === moduleId ? module.lessons.filter((entry) => entry.id !== lesson.id) : module.lessons,
            })),
          }))
          .filter((subject) => subject.modules.some((module) => module.lessons.length > 0 || module.id !== moduleId));
      }

      return subjects.map((subject) => ({
        ...subject,
        modules: subject.modules.map((module) => {
          if (module.id !== moduleId) {
            return module;
          }

          const nextLessons = [...module.lessons];
          const existingIndex = nextLessons.findIndex((entry) => entry.id === lesson.id);
          if (existingIndex === -1) {
            nextLessons.push(lesson);
          } else {
            nextLessons[existingIndex] = lesson;
          }

          nextLessons.sort((left, right) => left.order - right.order);
          return { ...module, lessons: nextLessons };
        }),
      }));
    };

    const bootRealtime = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return;
      }

      const channel = supabase.channel(`public:course-curriculum:${courseId}`);

      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, (payload) => {
        const raw = payload.eventType === 'DELETE' ? payload.old : payload.new;
        if (!raw || typeof raw !== 'object') {
          return;
        }

        queryClient.setQueryData<CourseSubject[]>(queryKey, (current) => {
          if (!current) {
            return current;
          }

          return patchLesson(current, raw as Record<string, unknown>, payload.eventType);
        });
      });

      void channel.subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    };

    let cleanup: (() => void) | undefined;
    void bootRealtime().then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      cleanup?.();
    };
  }, [courseId, moduleIdsKey, queryClient]);

  return query;
}

export function useCourseEnrollment(courseId: string, userId: string | null, studentId: string | null) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['courses', courseId, 'enrollment', userId, studentId],
    queryFn: () => fetchCourseEnrollment(courseId, userId, studentId),
    enabled: !!courseId && (Boolean(userId) || Boolean(studentId)),
  });

  useEffect(() => {
    if (!courseId || (!userId && !studentId)) {
      return;
    }

    const channel = supabase.channel(`public:course-enrollment:${courseId}:${userId ?? studentId}`);

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'enrollments',
        filter: userId ? `user_id=eq.${userId}` : `student_id=eq.${studentId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['courses', courseId, 'enrollment', userId, studentId] });
      }
    );

    void channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [courseId, queryClient, studentId, userId]);

  return query;
}
