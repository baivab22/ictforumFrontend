import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye, Users, FileText, TrendingUp, Calendar, Image, Upload, Settings, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
// import { toast } from '@/components/ui/use-toast';
// import CreatePostForm from '@/components/admin/CreatePostForm';
import EditPostForm from '@/components/admin/EditPostForm';
import LoginForm from '@/components/admin/LoginForm';
// import API, { Post, User, CreatePostData, UpdatePostData } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import CreatePostForm from '@/components/admin/CreatePostForm';
import API, { CreatePostData, Post, UpdatePostData, User } from '@/lib/api';

interface Stats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  featuredPosts: number;
  publishedPosts?: number;
  draftPosts?: number;
  monthlyViews?: number;
  monthlyPosts?: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    featuredPosts: 0
  });
  
  // UI state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  // Check authentication on component mount
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (API.utils.isAuthenticated()) {
        await fetchUserInfo();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('App initialization error:', error);
      handleAuthError();
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userData = await API.auth.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Fetch initial data
      await Promise.all([
        fetchPosts(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Fetch user info error:', error);
      handleAuthError();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async (page: number = 1) => {
    setIsPostsLoading(true);
    setPostsError(null);
    
    try {
      const response = await API.posts.getPosts({
        page,
        limit: 12,
        language: 'en'
      });
      
      setPosts(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);
      setTotalPosts(response.total);
    } catch (error) {
      const errorMessage = API.utils.formatErrorMessage(error);
      setPostsError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to fetch posts: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsPostsLoading(false);
    }
  };

  const fetchStats = async () => {
    setIsStatsLoading(true);
    
    try {
      const response = await API.stats.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use fallback stats if API fails
      setStats({
        totalPosts: totalPosts || 0,
        totalUsers: 0,
        totalViews: 0,
        featuredPosts: 0
      });
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleAuthError = () => {
    setUser(null);
    setIsAuthenticated(false);
    API.utils.removeToken();
    setError('Authentication failed. Please login again.');
  };

  const handleLogin = async (userData: User, token: string) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      API.utils.setToken(token);
      
      // Fetch data after login
      await Promise.all([
        fetchPosts(),
        fetchStats()
      ]);
      
      toast({
        title: "Success",
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await API.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setPosts([]);
      setStats({
        totalPosts: 0,
        totalUsers: 0,
        totalViews: 0,
        featuredPosts: 0
      });
    }
  };

  const handleCreatePost = async (postData: CreatePostData) => {
    try {
      const response = await API.posts.createPost(postData);
      
      // Add new post to the beginning of the list
      setPosts(prevPosts => [response.data, ...prevPosts]);
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalPosts: prevStats.totalPosts + 1,
        featuredPosts: postData.featured ? prevStats.featuredPosts + 1 : prevStats.featuredPosts
      }));
      
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    } catch (error) {
      const errorMessage = API.utils.formatErrorMessage(error);
      toast({
        title: "Error",
        description: `Failed to create post: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleEditPost = async (postData: UpdatePostData) => {
    if (!editingPost) return;
    
    try {
      const response = await API.posts.updatePost(editingPost.id, postData);
      
      // Update post in the list
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === editingPost.id ? response.data : post
        )
      );
      
      // Update stats if featured status changed
      if (postData.featured !== undefined && postData.featured !== editingPost.featured) {
        setStats(prevStats => ({
          ...prevStats,
          featuredPosts: postData.featured ? prevStats.featuredPosts + 1 : prevStats.featuredPosts - 1
        }));
      }
      
      setEditingPost(null);
      
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
    } catch (error) {
      const errorMessage = API.utils.formatErrorMessage(error);
      toast({
        title: "Error",
        description: `Failed to update post: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      await API.posts.deletePost(postId);
      
      // Remove post from the list
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalPosts: prevStats.totalPosts - 1,
        featuredPosts: post.featured ? prevStats.featuredPosts - 1 : prevStats.featuredPosts
      }));
      
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
    } catch (error) {
      const errorMessage = API.utils.formatErrorMessage(error);
      toast({
        title: "Error",
        description: `Failed to delete post: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = async () => {
    await Promise.all([
      fetchPosts(currentPage),
      fetchStats()
    ]);
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      technology: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      digitalTransformation: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      socialJustice: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      events: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
      innovation: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white',
      policy: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
      education: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
      startups: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
    };
    return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {error && (
          <Alert className="mx-4 mt-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-teal-900 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-blue-200">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshData}
                disabled={isPostsLoading || isStatsLoading}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${(isPostsLoading || isStatsLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="text-right">
                <p className="text-sm text-blue-200">ICT Forum Nepal</p>
                <p className="text-xs text-blue-300">Management Portal</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Posts</p>
                  {isStatsLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p className="text-4xl font-bold">{stats.totalPosts}</p>
                  )}
                  <p className="text-blue-200 text-xs mt-1">Published & Draft</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <FileText size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Users</p>
                  {isStatsLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p className="text-4xl font-bold">{stats.totalUsers}</p>
                  )}
                  <p className="text-green-200 text-xs mt-1">Registered users</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <Users size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Views</p>
                  {isStatsLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p className="text-4xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  )}
                  <p className="text-purple-200 text-xs mt-1">All time views</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <TrendingUp size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Featured Posts</p>
                  {isStatsLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <p className="text-4xl font-bold">{stats.featuredPosts}</p>
                  )}
                  <p className="text-orange-200 text-xs mt-1">Currently active</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <Calendar size={28} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[500px] bg-white shadow-lg border-0">
            <TabsTrigger value="posts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Manage Posts ({totalPosts})
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
              Media Library
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Enhanced Posts Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Posts Management</h2>
                <p className="text-gray-600">Create and manage your blog posts</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3">
                    <Plus className="mr-2" size={18} />
                    Create New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      Create New Post
                    </DialogTitle>
                  </DialogHeader>
                  <CreatePostForm onSubmit={handleCreatePost} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Error Alert */}
            {postsError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {postsError}
                  <Button
                    variant="link"
                    className="ml-2 p-0 h-auto text-red-800 underline"
                    onClick={() => fetchPosts(currentPage)}
                  >
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Posts Loading State */}
            {isPostsLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">Loading posts...</span>
              </div>
            )}

            {/* Enhanced Posts Grid */}
            {!isPostsLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title_en}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/400/200';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getCategoryColor(post.category)}>
                          {t(`categories.${post.category}`, post.category)}
                        </Badge>
                      </div>
                      {post.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg">
                            ⭐ Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {post.title_en}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>By {post.author?.name || 'Unknown'}</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            {post.views}
                          </span>
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments.length}</span>
                        </div>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPost(post)}
                          className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchPosts(currentPage - 1)}
                  disabled={currentPage <= 1 || isPostsLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchPosts(currentPage + 1)}
                  disabled={currentPage >= totalPages || isPostsLoading}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isPostsLoading && posts.length === 0 && !postsError && (
              <div className="text-center py-12">
                <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first blog post
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Plus className="mr-2" size={16} />
                  Create Your First Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Image className="mr-2 text-green-600" size={24} />
                  Media Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Upload size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Media Files</h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop images here or click to browse
                  </p>
                  <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    <Upload className="mr-2" size={16} />
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <TrendingUp className="mr-2 text-purple-600" size={24} />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 mb-6">
                    Detailed insights and performance metrics
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                      <h4 className="font-semibold text-blue-900">Page Views</h4>
                      <p className="text-2xl font-bold text-blue-700">{stats.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                      <h4 className="font-semibold text-green-900">Published Posts</h4>
                      <p className="text-2xl font-bold text-green-700">{stats.publishedPosts || stats.totalPosts}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                      <h4 className="font-semibold text-purple-900">Draft Posts</h4>
                      <p className="text-2xl font-bold text-purple-700">{stats.draftPosts || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Post Dialog */}
        {editingPost && (
          <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Edit Post
                </DialogTitle>
              </DialogHeader>
              <EditPostForm 
                post={editingPost} 
                onSubmit={handleEditPost}
                onCancel={() => setEditingPost(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;