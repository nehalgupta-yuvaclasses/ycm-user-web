import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  Target,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const struggleGallery = [
  {
    src: '/images/nehalsir_struggle_pics/IMG-20240813-WA0042.jpg.jpeg',
    alt: 'Nehal Sir in the early days of teaching',
    caption: 'Small Beginnings',
    note: 'Where every whiteboard session was a step toward a bigger dream.',
  },
  {
    src: '/images/nehalsir_struggle_pics/IMG-20240813-WA0078.jpg.jpeg',
    alt: 'Nehal Sir during a deep preparation phase',
    caption: 'The Hustle',
    note: 'Late nights and early mornings dedicated to building a better system.',
  },
  {
    src: '/images/nehalsir_struggle_pics/IMG20250711123903.jpg.jpeg',
    alt: 'Nehal Sir at a student meetup',
    caption: 'Ground Reality',
    note: 'Staying connected with students to understand their daily challenges.',
  },
  {
    src: '/images/nehalsir_struggle_pics/IMG_20241221_014824_418.jpg.jpeg',
    alt: 'Nehal Sir in a study session',
    caption: 'Consistency',
    note: 'Leading by example and showing that discipline is the only shortcut.',
  },
];

const classroomGallery = [
  { src: '/images/class-photos/IMG-20250701-WA0016.jpg.jpeg', alt: 'Yuva Classes classroom' },
  { src: '/images/class-photos/IMG20250711123835.jpg.jpeg', alt: 'Students in a lecture' },
  { src: '/images/class-photos/IMG_2055.JPG.jpeg', alt: 'Nehal Sir teaching' },
  { src: '/images/class-photos/IMG_2056.JPG.jpeg', alt: 'Classroom environment' },
  { src: '/images/class-photos/IMG_2063.JPG.jpeg', alt: 'Interactive session' },
  { src: '/images/class-photos/IMG_2064.JPG.jpeg', alt: 'Study materials' },
  { src: '/images/class-photos/IMG_2065.JPG.jpeg', alt: 'Focused aspirants' },
  { src: '/images/class-photos/IMG_4664.JPG.jpeg', alt: 'Full classroom view' },
  { src: '/images/class-photos/IMG_4665.JPG.jpeg', alt: 'Mentorship moment' },
  { src: '/images/class-photos/IMG_4666.JPG.jpeg', alt: 'Doubt clearing session' },
  { src: '/images/class-photos/IMG_4668.JPG.jpeg', alt: 'Motivation session' },
];

const differenceItems = [
  {
    icon: BookOpen,
    title: 'Structured preparation system',
    description: 'Every batch follows a clear sequence for learning, revision, and testing.',
  },
  {
    icon: Users,
    title: 'Real mentorship',
    description: 'Students get guidance from teachers who know the pressure of competitive exams.',
  },
  {
    icon: Target,
    title: 'Discipline-first approach',
    description: 'The focus stays on consistency, accountability, and habits that compound.',
  },
  {
    icon: BarChart3,
    title: 'Data-driven learning',
    description: 'Tests and performance tracking are used to correct weak spots quickly.',
  },
];

const timeline = [
  { year: '2022', title: 'Started', text: 'Yuva Classes began with a small teaching setup and a clear need for better guidance.' },
  { year: '2023', title: 'Growth', text: 'More students joined, and the preparation model became more structured and repeatable.' },
  { year: '2024', title: 'Expansion', text: 'Courses, mentors, and test support grew around the same core discipline-first method.' },
  { year: '2025', title: 'Platform scale', text: 'The learning experience expanded into a more complete platform for serious aspirants.' },
];

const impactStats = [
  { value: '10,000+', label: 'Students trained' },
  { value: '500+', label: 'Success stories' },
  { value: '120+', label: 'Courses delivered' },
];

export default function About() {
  return (
    <div className="bg-white text-zinc-950 scroll-smooth">
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 overflow-hidden bg-zinc-50 border-b border-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-left space-y-6 md:space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight leading-[1.1]"
            >
              Defining the Future of <br className="hidden md:block" />
              <span className="text-zinc-400">Competitive Excellence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed"
            >
              A focused learning environment for students who want structure, accountability, and a real path toward government exam success. Founded by Nehal Gupta • Built for serious aspirants.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8 lg:py-24">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Yuva Classes</h2>
              <p className="max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
                Yuva Classes is a competitive exam preparation platform for students who need a clear system, the right mentorship, and a learning environment that keeps them moving forward.
              </p>
            </div>

            <div className="space-y-4 text-sm leading-7 text-zinc-600 sm:text-base">
              <p>
                We help aspirants prepare with focused batches, practical study plans, and regular testing that shows what is improving and what still needs work.
              </p>
              <p>
                The platform exists for students who want more than scattered lectures. It is for people who need direction, consistency, and a teacher who can keep the journey grounded.
              </p>
              <p>
                Our work is simple: make serious preparation easier to follow and harder to drift away from.
              </p>
            </div>
          </div>

          <Card className="border-zinc-200 bg-zinc-50 shadow-sm">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <img
                  src="/images/yc_logo.png"
                  alt="Yuva Classes Logo"
                  className="h-64 w-full object-contain p-8"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-sm font-medium text-zinc-950">Who it is for</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">Students preparing for SSC, police, railways, and other competitive exams.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-sm font-medium text-zinc-950">Why it exists</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">To replace confusion with a preparation path students can actually follow.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-6">
            <p className="text-sm font-medium text-zinc-500">The real story</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">It Didn’t Start with Success.</h2>
            <div className="space-y-5 text-base leading-8 text-zinc-700 sm:text-lg">
              <p>
                It began with students who were putting in the hours but still not seeing the results they expected. The work was there, but the direction was not.
              </p>
              <p>
                Preparation often felt confusing. One day it was one strategy, the next day it was another. Too many students were left to guess what mattered most, and that guesswork cost them time, confidence, and momentum.
              </p>
              <p>
                Yuva Classes was built from that reality. The decision was not to create more noise. It was to create a place where serious aspirants could prepare with clarity, discipline, and a system that respected the effort they were already making.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8 lg:py-24">
          <Card className="overflow-hidden border-zinc-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
                <img
                  src="/images/nehalsir_pic.png"
                  alt="Nehal Gupta, founder and director of Yuva Classes"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center">
            <Card className="w-full border-zinc-200 bg-white shadow-sm">
              <CardHeader className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-zinc-500">Founder spotlight</p>
                  <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">Nehal Gupta</CardTitle>
                  <p className="text-sm text-zinc-600">Founder & Director</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pb-6 text-sm leading-7 text-zinc-600 sm:text-base">
                <p>
                  Nehal Gupta built Yuva Classes with the belief that serious preparation should feel structured, accessible, and personal. The focus has always been on helping students stay consistent long enough to see real change.
                </p>
                <p>
                  His approach is practical rather than performative: teach clearly, test regularly, and keep students accountable to the work that matters.
                </p>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-zinc-900">
                  <p className="text-sm font-medium leading-7 sm:text-base">
                    “A student does not need more confusion. They need clarity, repetition, and someone who will keep the path honest.”
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-8 space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Struggle gallery</h2>
            <p className="max-w-2xl text-base leading-7 text-zinc-600">A quiet record of the environment that shaped the platform and the people who kept showing up for it.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {struggleGallery.map((item) => (
              <Card key={item.caption} className="overflow-hidden border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover transition-all duration-500 hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-60" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-sm font-semibold tracking-wide uppercase">{item.caption}</p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-300 line-clamp-2">{item.note}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Our Classroom</h2>
            <p className="max-w-2xl text-base leading-7 text-zinc-600">The everyday environment where discipline meets direction. This is where the work happens.</p>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 space-y-4">
            {classroomGallery.map((item, i) => (
              <div key={i} className="break-inside-avoid overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full object-cover transition-all duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold">Mission</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm leading-7 text-zinc-600 sm:text-base">
              To give aspirants a preparation system that feels clear enough to trust and disciplined enough to follow every day.
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold">Vision</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm leading-7 text-zinc-600 sm:text-base">
              To become the most dependable learning environment for students who want honest guidance and measurable progress.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-8 space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What makes us different</h2>
            <p className="max-w-2xl text-base leading-7 text-zinc-600">The difference is not a slogan. It is the way the system is built.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {differenceItems.map((item) => (
              <Card key={item.title} className="border-zinc-200 bg-white shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900">
                    <item.icon className="size-5" />
                  </div>
                  <CardTitle className="text-base font-medium leading-6">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 text-sm leading-6 text-zinc-600">{item.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-8 space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Impact</h2>
            <p className="max-w-2xl text-base leading-7 text-zinc-600">Real numbers matter more than polished claims.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {impactStats.map((stat) => (
              <Card key={stat.label} className="border-zinc-200 bg-white shadow-sm">
                <CardContent className="space-y-2 p-6">
                  <p className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">{stat.value}</p>
                  <p className="text-sm text-zinc-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-8 space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Journey timeline</h2>
            <p className="text-base leading-7 text-zinc-600">A simple view of how the platform grew.</p>
          </div>

          <div className="space-y-0">
            {timeline.map((step, index) => (
              <div key={step.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex size-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-sm font-medium text-zinc-950">
                    {step.year.slice(-2)}
                  </div>
                  {index < timeline.length - 1 ? <div className="h-full w-px bg-zinc-200" /> : null}
                </div>
                <div className="pb-10">
                  <p className="text-sm text-zinc-500">{step.year}</p>
                  <h3 className="mt-1 text-lg font-medium text-zinc-950">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Your Turning Point Starts Here.</h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              If you are ready to prepare with clarity, discipline, and real support, Yuva Classes is built for that decision.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button nativeButton={false} render={<Link to="/courses" />} className="w-full sm:w-auto">
              Explore Courses
              <ChevronRight className="size-4" />
            </Button>
            <Button nativeButton={false} render={<Link to="/contact" />} variant="outline" className="w-full sm:w-auto">
              Talk to Mentor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
