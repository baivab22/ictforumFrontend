import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  Share2, 
  ExternalLink,
  Copy,
  Check,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
// import { toast } from '@/components/ui/use-toast';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author?: string;
  publishedAt: string;
  featured?: boolean;
  contentEn: string;
}

// Enhanced Social Media Icons with Brand Colors
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg className={`w-${size/4} h-${size/4}`} fill="#1877F2" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg className={`w-${size/4} h-${size/4}`} fill="#1DA1F2" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg className={`w-${size/4} h-${size/4}`} fill="#0A66C2" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg className={`w-${size/4} h-${size/4}`} fill="#25D366" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.863 3.488"/>
  </svg>
);

const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg className={`w-${size/4} h-${size/4}`} fill="#0088CC" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const RedditIcon = ({ size = 18 }: { size?: number }) => (
  <svg className={`w-${size/4} h-${size/4}`} fill="#FF4500" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg className={`w-${size/4} h-${size/4}`} fill="url(#instagram-gradient)" viewBox="0 0 24 24" width={size} height={size}>
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#833ab4'}} />
        <stop offset="50%" style={{stopColor:'#fd1d1d'}} />
        <stop offset="100%" style={{stopColor:'#fcb045'}} />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  excerpt,
  image,
  category,
  author = 'Anonymous',
  publishedAt,
  featured = false,
  contentEn
}) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const postUrl = `${window.location.origin}/post/${id}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedExcerpt = encodeURIComponent(excerpt);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'np' ? 'ne-NP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      technology: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      digitalTransformation: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      socialJustice: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white',
      events: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
      innovation: 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white',
      policy: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
      education: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
      startups: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
    };
    return colors[cat] || 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Post link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const socialShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const handleSocialShare = (platform: string) => {
    const url = socialShareLinks[platform as keyof typeof socialShareLinks];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Card className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg bg-white ${
      featured ? 'ring-2 ring-gradient-to-r from-green-400 to-teal-400 ring-opacity-60' : ''
    } hover:shadow-blue-100/50`}>
      
      {/* Image Header */}
      <CardHeader className="p-0 relative">
        <div className="relative overflow-hidden group">
          <img
              src={`http://localhost:8000/api/posts/images/${image}`}
            alt={title}
            className="w-full h-52 object-cover transition-all duration-700 group-hover:scale-105"
          />

          <p>{contentEn}</p>


          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60" />
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black border-0 shadow-lg font-semibold px-3 py-1">
                ✨ Featured
              </Badge>
            </div>
          )}


          
          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className={`${getCategoryColor(category)} border-0 shadow-lg font-semibold px-3 py-1`}>
              {t(`categories.${category}`)}
            </Badge>
          </div>

          {/* Reading Time Indicator */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-gray-700">
              <BookOpen size={12} />
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        
        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
              <span className="font-medium">{author}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-400">
              <Calendar size={12} />
              <span>{formatDate(publishedAt)}</span>
            </div>
          </div>
        </div>



        {/* Social Media Share Icons */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              
              <button
                onClick={() => handleSocialShare('facebook')}
                className="p-2 rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-110 group/social"
                title="Share on Facebook"
              >
                <FacebookIcon size={16} />
              </button>
              
              <button
                onClick={() => handleSocialShare('twitter')}
                className="p-2 rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-110 group/social"
                title="Share on Twitter"
              >
                <TwitterIcon size={16} />
              </button>
              
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="p-2 rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-110 group/social"
                title="Share on LinkedIn"
              >
                <LinkedInIcon size={16} />
              </button>
              
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="p-2 rounded-full hover:bg-green-50 transition-all duration-300 hover:scale-110 group/social"
                title="Share on WhatsApp"
              >
                <WhatsAppIcon size={16} />
              </button>
              
              <button
                onClick={() => handleSocialShare('telegram')}
                className="p-2 rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-110 group/social"
                title="Share on Telegram"
              >
                <TelegramIcon size={16} />
              </button>
              
              <button
                onClick={() => handleSocialShare('reddit')}
                className="p-2 rounded-full hover:bg-orange-50 transition-all duration-300 hover:scale-110 group/social"
                title="Share on Reddit"
              >
                <RedditIcon size={16} />
              </button>
              
              <div className="w-px h-4 bg-gray-200 mx-1" />
              
              <button
                onClick={handleCopyLink}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  copied 
                    ? 'bg-green-100 text-green-600' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Copy Link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-6 pb-6 pt-0">
        <Link to={`/post/${id}`} className="w-full">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold py-2.5"
          >
            {t('home.readMore')}
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;