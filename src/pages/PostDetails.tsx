import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Tag, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import NewsCard from '@/components/NewsCard';

const PostDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  // Mock data for demonstration
  const post = {
    id: '1',
    title: 'Digital Nepal Initiative: Transforming Rural Communities',
    content: `
      <p>Nepal's digital transformation journey has reached a pivotal moment with the launch of the Digital Nepal Initiative, a comprehensive program aimed at bridging the digital divide between urban and rural communities across the country.</p>
      
      <h2>The Challenge</h2>
      <p>Despite significant progress in urban areas, many rural communities in Nepal still lack access to basic digital infrastructure and services. This digital divide has created disparities in education, healthcare, economic opportunities, and access to government services.</p>
      
      <h2>Our Approach</h2>
      <p>The Digital Nepal Initiative takes a multi-faceted approach to address these challenges:</p>
      <ul>
        <li><strong>Infrastructure Development:</strong> Expanding fiber optic networks and mobile connectivity to remote areas</li>
        <li><strong>Digital Literacy Programs:</strong> Training community members in basic digital skills</li>
        <li><strong>E-Government Services:</strong> Bringing government services online and making them accessible to rural populations</li>
        <li><strong>Economic Empowerment:</strong> Enabling rural entrepreneurs to access digital markets and financial services</li>
      </ul>
      
      <h2>Impact and Results</h2>
      <p>Since its launch, the initiative has already made significant progress:</p>
      <ul>
        <li>Connected over 500 rural communities to high-speed internet</li>
        <li>Trained more than 10,000 individuals in digital literacy</li>
        <li>Enabled 200+ rural businesses to go digital</li>
        <li>Reduced the time for accessing government services by 70%</li>
      </ul>
      
      <h2>Looking Forward</h2>
      <p>The Digital Nepal Initiative represents just the beginning of our country's digital transformation. By 2030, we aim to ensure that every Nepali citizen has access to digital services and opportunities, regardless of their geographic location.</p>
      
      <p>This initiative is a testament to what's possible when technology is used as a force for social good and inclusive development. Together, we're building a digitally empowered Nepal where no one is left behind.</p>
    `,
    image: '/assets/images/WhatsApp Image 2025-09-26 at 8.50.22 PM.jpeg',
    category: 'digitalTransformation',
    author: 'Dr. Ramesh Sharma',
    publishedAt: '2024-09-25',
    readTime: '8 min read',
    tags: ['Digital Transformation', 'Rural Development', 'ICT Policy', 'Social Impact'],
  };

  const relatedPosts = [
    {
      id: '2',
      title: 'Youth Innovation in Tech Startups',
      excerpt: 'Exploring the rising trend of young entrepreneurs creating innovative solutions.',
      image: '/assets/images/WhatsApp Image 2025-09-26 at 8.50.23 PM.jpeg',
      category: 'startups',
      author: 'Sita Gurung',
      publishedAt: '2024-09-24',
    },
    {
      id: '3',
      title: 'AI for Social Justice: A Nepali Perspective',
      excerpt: 'How artificial intelligence can be leveraged to address social inequalities.',
      image: '/assets/images/WhatsApp Image 2025-09-26 at 8.50.22 PM (1).jpeg',
      category: 'socialJustice',
      author: 'Prof. Bikash Koirala',
      publishedAt: '2024-09-23',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'np' ? 'ne-NP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      technology: 'bg-blue-100 text-blue-800 border-blue-200',
      digitalTransformation: 'bg-green-100 text-green-800 border-green-200',
      socialJustice: 'bg-purple-100 text-purple-800 border-purple-200',
      events: 'bg-orange-100 text-orange-800 border-orange-200',
      innovation: 'bg-teal-100 text-teal-800 border-teal-200',
      policy: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      education: 'bg-pink-100 text-pink-800 border-pink-200',
      startups: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/news">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="mr-2" size={20} />
              Back to News
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge className={`${getCategoryColor(post.category)} border mb-4`}>
                {t(`categories.${post.category}`)}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={18} />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="text-sm">
                {post.readTime}
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Heart size={16} className="mr-1" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 size={16} className="mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src="/assets/images/WhatsApp Image 2025-09-26 at 8.50.23 PM (1).jpeg"
                    alt={post.author}
                    className="w-20 h-20 rounded-full object-cover border-4 border-green-500"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
                    <p className="text-gray-600 mb-4">
                      Dr. Ramesh Sharma is a leading expert in digital transformation with over 15 years 
                      of experience in ICT policy development and implementation. He has been instrumental 
                      in driving Nepal's digital agenda and promoting inclusive technology adoption.
                    </p>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm">Follow</Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle size={16} className="mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('post.relatedPosts')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <NewsCard key={relatedPost.id} {...relatedPost} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostDetails;