import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  User, 
  Clock,
  ArrowRight, 
  Share2,
  Copy,
  Check,
  Eye,
  MessageCircle,
  Bookmark,
  X
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author?: string;
  publishedAt: string;
  featured?: boolean;
  content: string;
  viewCount?: number;
  commentCount?: number;
}

// Get API URL based on environment (Vite)
const API_URL = 
// import.meta.env.MODE === 'production'
//   ? import.meta.env.VITE_PROD_URL ||
  
  'https://ictforumbackend-5.onrender.com/api'
  // :
  //  import.meta.env.VITE_DEV_URL || 'http://localhost:8000/api';

// Social Media Icons
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.863 3.488"/>
  </svg>
);

const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const RedditIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const EmailIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
  content,
  viewCount = 0,
  commentCount = 0
}) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSocialPlugin, setShowSocialPlugin] = useState(false);
  const [imageError, setImageError] = useState(false);

  const postUrl = `${window.location.origin}/post/${id}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(postUrl);

  console.log('API_URL:', content);

  // Construct image URL properly
  const getImageUrl = () => {
    if (!image) return '/placeholder-image.jpg';
    
    // If image is already a full URL, use it as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Otherwise, construct the URL from API_URL
    return `${API_URL}/posts/images/${image}`;
  };

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
      technology: 'bg-blue-500/10 text-blue-700 border-blue-200',
      digitalTransformation: 'bg-green-500/10 text-green-700 border-green-200',
      socialJustice: 'bg-purple-500/10 text-purple-700 border-purple-200',
      events: 'bg-orange-500/10 text-orange-700 border-orange-200',
      innovation: 'bg-teal-500/10 text-teal-700 border-teal-200',
      policy: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
      education: 'bg-pink-500/10 text-pink-700 border-pink-200',
      startups: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    };
    return colors[cat] || 'bg-gray-500/10 text-gray-700 border-gray-200';
  };

  // Calculate reading time from content
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text?.trim()?.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
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
    email: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
  };

  const handleSocialShare = (platform: string) => {
    const url = socialShareLinks[platform as keyof typeof socialShareLinks];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      setShowSocialPlugin(false);
    }
  };

  const readingTime = calculateReadingTime(content);

  console.log(content,"content in card");

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-xl border ${
      featured ? 'border-amber-200 bg-gradient-to-br from-amber-50/30 to-white' : 'border-gray-100 bg-white'
    } rounded-2xl relative`}>
      
      {/* Social Media Plugin */}
      {showSocialPlugin && (
        <div 
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-20 bg-white rounded-l-2xl shadow-2xl border border-gray-200 p-3 flex flex-col gap-2"
          style={{
            animation: 'slideIn 0.3s ease-out forwards'
          }}
        >
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%) translateY(-50%);
                opacity: 0;
              }
              to {
                transform: translateX(0) translateY(-50%);
                opacity: 1;
              }
            }
          `}</style>
          
          <button
            onClick={() => setShowSocialPlugin(false)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-l-lg shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
            title="Close"
          >
            <X size={16} className="text-gray-600" />
          </button>
          
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-700 px-2 pb-1 border-b border-gray-200">
              Share Article
            </p>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSocialShare('facebook');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all duration-200 hover:scale-105"
              title="Share on Facebook"
            >
              <FacebookIcon size={18} />
              <span className="text-sm font-medium">Facebook</span>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSocialShare('twitter');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sky-50 text-sky-600 transition-all duration-200 hover:scale-105"
              title="Share on Twitter"
            >
              <TwitterIcon size={18} />
              <span className="text-sm font-medium">Twitter</span>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSocialShare('linkedin');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-all duration-200 hover:scale-105"
              title="Share on LinkedIn"
            >
              <LinkedInIcon size={18} />
              <span className="text-sm font-medium">LinkedIn</span>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSocialShare('whatsapp');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-600 transition-all duration-200 hover:scale-105"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon size={18} />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSocialShare('telegram');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-all duration-200 hover:scale-105"
              title="Share on Telegram"
            >
              <TelegramIcon size={18} />
              <span className="text-sm font-medium">Telegram</span>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSocialShare('reddit');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 text-orange-600 transition-all duration-200 hover:scale-105"
              title="Share on Reddit"
            >
              <RedditIcon size={18} />
              <span className="text-sm font-medium">Reddit</span>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSocialShare('email');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-all duration-200 hover:scale-105"
              title="Share via Email"
            >
              <EmailIcon size={18} />
              <span className="text-sm font-medium">Email</span>
            </button>
            
            <div className="border-t border-gray-200 pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCopyLink();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full transition-all duration-200 hover:scale-105 ${
                  copied 
                    ? 'bg-green-50 text-green-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                title={copied ? "Link copied!" : "Copy link"}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span className="text-sm font-medium">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Share Button */}
      {!showSocialPlugin && (
        <button
          onClick={() => setShowSocialPlugin(true)}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-gradient-to-l from-blue-600 to-blue-500 text-white rounded-l-lg shadow-lg p-3 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:pr-4 group/share"
          title="Share this article"
        >
          <Share2 size={18} className="group-hover/share:scale-110 transition-transform" />
        </button>
      )}
      
      {/* Image Header */}
      <CardHeader className="p-0 relative">
        <Link to={`/post/${id}`} className="block relative overflow-hidden">
          <div className="aspect-video relative bg-gray-100">
            {/* {!imageError ? ( */}
              <img
                src={getImageUrl()}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            {/* ) */}
            
             {/* : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="text-gray-400 text-sm">Image unavailable</span>
              </div>
            )} */}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            
            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg font-semibold text-xs px-3 py-1">
                  ⭐ Featured
                </Badge>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 right-3">
              <Badge className={`${getCategoryColor(category)} border backdrop-blur-sm font-medium text-xs px-3 py-1`}>
                {t(`categories.${category}`)}
              </Badge>
            </div>

            {/* Action Buttons Overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsBookmarked(!isBookmarked);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                  isBookmarked 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowShareMenu(!showShareMenu);
                  }}
                  className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-md transition-all duration-300"
                  title="Share article"
                >
                  <Share2 size={16} />
                </button>
                
                {/* Share Dropdown */}
                {showShareMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 flex gap-1 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSocialShare('facebook');
                      }}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      title="Share on Facebook"
                    >
                      <FacebookIcon size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSocialShare('twitter');
                      }}
                      className="p-2 rounded-lg hover:bg-sky-50 text-sky-600 transition-colors"
                      title="Share on Twitter"
                    >
                      <TwitterIcon size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSocialShare('linkedin');
                      }}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors"
                      title="Share on LinkedIn"
                    >
                      <LinkedInIcon size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSocialShare('whatsapp');
                      }}
                      className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <WhatsAppIcon size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopyLink();
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        copied 
                          ? 'bg-green-50 text-green-600' 
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                      title={copied ? "Link copied!" : "Copy link"}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-5 space-y-3">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(publishedAt)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/post/${id}`}>
          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        {/* Content Preview - Show first 100 characters */}
        {content && content.length > 0 && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 pt-1 border-t border-gray-50">
            {content.substring(0, 150)}...
          </p>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-gray-100">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{author}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {viewCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {commentCount}
              </span>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Link to={`/post/${id}`}>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 h-9 font-medium shadow-sm hover:shadow transition-all duration-300"
          >
            Read
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;