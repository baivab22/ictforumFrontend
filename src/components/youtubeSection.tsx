import React, { useState, useEffect } from 'react';
import { Play, Calendar, Eye, ExternalLink, RefreshCw, AlertCircle, Youtube, Clock, ThumbsUp, Share2 } from 'lucide-react';

const ModernYouTubeSection = ({ 
  maxVideos = 6,
  showViewCount = true,
  showPublishDate = true,
  autoRefresh = false,
  refreshInterval = 300000,
  sectionTitle = "Latest Videos",
  showRefreshButton = true,
  backendUrl = 'http://localhost:8000'
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [channelInfo, setChannelInfo] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const fetchVideos = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch(
        `${backendUrl}/api/youtube/videos?maxResults=${maxVideos}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
        setChannelInfo(data.channelInfo || null);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch videos');
      }
      
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    
    let interval;
    if (autoRefresh && refreshInterval > 0) {
      interval = setInterval(() => {
        fetchVideos(true);
      }, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [maxVideos, autoRefresh, refreshInterval]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
      return `${Math.ceil(diffDays / 365)} years ago`;
    } catch {
      return 'Unknown date';
    }
  };

  const formatViewCount = (count) => {
    if (!count || count === '0') return '0 views';
    const num = parseInt(count);
    if (isNaN(num)) return '0 views';
    
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace('.0', '')}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace('.0', '')}K views`;
    return `${num.toLocaleString()} views`;
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    let formatted = '';
    if (hours) formatted += `${hours}:`;
    formatted += `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    
    return formatted;
  };

  const openVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
  };

  const handleRefresh = () => {
    fetchVideos(true);
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-100">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && videos.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Videos
            </h2>
          </div>
          <div className="bg-white border border-red-100 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Videos</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest Videos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch our latest content and stay updated with new releases.
          </p>
        </div>

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Youtube className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Videos Available</h3>
            <p className="text-gray-600">Check back later for new content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <article 
                key={video.id} 
                className="group bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                onClick={() => openVideo(video.id)}
              >
                {/* Video Thumbnail */}
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    }}
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className={`transform transition-all duration-300 ${hoveredVideo === video.id ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                      <div className="bg-white rounded-full p-4 shadow-lg">
                        <Play className="text-red-600 w-8 h-8 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Duration badge */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>
                
                {/* Video Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  
                  {video.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                  
                  {/* Video Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {showPublishDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    )}
                    
                    {showViewCount && video.viewCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatViewCount(video.viewCount)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideo(video.id);
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.share ? 
                          navigator.share({
                            title: video.title,
                            url: `https://www.youtube.com/watch?v=${video.id}`
                          }) :
                          navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
                      }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Share video"
                    >
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    {video.likeCount && parseInt(video.likeCount) > 0 && (
                      <div className="flex items-center text-gray-500">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">{formatViewCount(video.likeCount).replace(' views', '')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button */}
        {videos.length > 0 && (
          <div className="text-center mt-12">
            <a
              href="https://www.youtube.com/channel/UCbuj4kbjP05NLiWUbpSuBPw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-lg hover:from-black hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Youtube className="w-5 h-5 mr-2" />
              <span>Visit Our Channel</span>
              <ExternalLink className="w-5 h-5 ml-2" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ModernYouTubeSection;