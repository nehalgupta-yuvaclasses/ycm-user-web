import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Download, 
  ShoppingBag, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Share2,
  ShieldCheck,
  Eye,
  Loader2,
  Info,
  Video,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useResource } from '@/features/resources/hooks';
import { toast } from 'sonner';
import { useAuthModal } from '@/contexts/AuthContext';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openAuthModal, user } = useAuthModal();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: resource, isLoading, isError } = useResource(id || '');

  useEffect(() => {
    if (isError) {
      toast.error('Resource not found');
      navigate('/resources');
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  if (!resource) return null;

  const handleDownload = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setIsDownloading(true);
    toast.info('Starting download...');
    
    try {
      // In a real app, this would be a direct download or a signed URL
      window.open(resource.file_url, '_blank');
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to start download');
    } finally {
      setIsDownloading(false);
    }
  };

  const Icon = resource.type === 'pdf' ? FileText : resource.type === 'video' ? Video : LinkIcon;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <Link 
          to="/resources" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to Resources</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Preview & Visuals */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-2xl shadow-zinc-200/50 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-zinc-300">
                <Icon className="w-12 h-12" />
              </div>
            </motion.div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-zinc-900">About this resource</h3>
              <div className="prose prose-zinc max-w-none">
                <p className="text-zinc-600 leading-relaxed text-lg">
                  {resource.description || 'No description available for this resource.'}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 list-none p-0">
                  {[
                    'High-quality digital format',
                    'Compatible with all devices',
                    'Lifetime access and updates',
                    'Expertly curated content',
                    'Practice questions included',
                    'Exclusive exam shortcuts'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-zinc-900 text-white border-none px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                    {resource.type}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight">
                  {resource.title}
                </h1>
              </div>

              <Card className="p-8 border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-[2rem]">
                <div className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-emerald-600">Free</span>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full h-14 bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl text-lg font-bold shadow-xl shadow-zinc-900/20 gap-3"
                    >
                      {isDownloading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <Download className="w-5 h-5" />
                          Download {resource.type.toUpperCase()}
                        </>
                      )}
                    </Button>
                    <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Direct download available for registered users
                    </p>
                  </div>

                  <Separator className="bg-zinc-100" />

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Type</span>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold capitalize">
                        <FileText className="w-4 h-4" />
                        {resource.type}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Last Updated</span>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold">
                        <Clock className="w-4 h-4" />
                        {new Date(resource.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex items-center justify-center gap-8">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied!');
                  }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <div className="h-4 w-px bg-zinc-200" />
                <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-xs uppercase tracking-widest">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

