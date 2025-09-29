import React, { useState } from 'react';

export const ModernYoutubeSection = () => {
  const videos = [
    {
      id: "ODSfyJy8CAo",
      title: "New Maobadi Krantikari Song",
      subtitle: "Kasle bhanchh safal hudaina || Maila Lama",
      thumbnail: `https://img.youtube.com/vi/ODSfyJy8CAo/maxresdefault.jpg`
    },
    // {
    //   id: "dQw4w9WgXcQ",
    //   title: "Sample Video 2",
    //   subtitle: "Add your video description here",
    //   thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`
    // },
    // Add more videos here...
  ];

  const [hoveredVideo, setHoveredVideo] = useState(null);

  const openYoutubeInNewTab = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
  };

  const handleThumbnailClick = (videoId) => {
    openYoutubeInNewTab(videoId);
  };

  return (
    <div className="min-h-screen py-20 px-6 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <div className="w-20 h-1 bg-red-600 mx-auto mb-4"></div>
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured Videos
            </h1>
          </div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Watch our latest revolutionary content and stay updated with our movement
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div 
              key={video.id}
              className="group bg-gray-800 rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-gray-700"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              {/* Video Thumbnail with Play Button */}
              <div 
                className="relative aspect-video cursor-pointer overflow-hidden"
                onClick={() => handleThumbnailClick(video.id)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`transform transition-all duration-300 ${
                    hoveredVideo === video.id ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className="bg-red-600 rounded-full p-5 shadow-2xl group-hover:bg-red-500 transition-colors duration-300">
                      <svg 
                        className="w-8 h-8 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* YouTube Logo */}
                <div className="absolute top-4 right-4 bg-black/80 rounded-lg px-2 py-1">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white leading-tight flex-1 pr-4 group-hover:text-red-400 transition-colors duration-300">
                    {video.title}
                  </h3>
                  <button
                    onClick={() => openYoutubeInNewTab(video.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-300"
                    title="Open in YouTube"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-400 leading-relaxed">{video.subtitle}</p>
                
                {/* Watch on YouTube Button */}
                <button
                  onClick={() => openYoutubeInNewTab(video.id)}
                  className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  Watch on YouTube
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">No videos available</div>
            <div className="text-gray-600">Add video data to see them displayed here</div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">Want to see more content?</p>
          <button
            onClick={() => window.open('https://www.youtube.com/@Krish_ICT/playlists', '_blank')}
            className="bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-3 px-8 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Visit Our YouTube Channel
          </button>
        </div>
      </div>
    </div>
  );
};