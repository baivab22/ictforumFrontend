import React, { useState } from 'react';
import { Upload, Image, Eye, Save, X } from 'lucide-react';

const CreatePostForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title_en: '',
    content_en: '',
    excerpt_en: '',
    category: '',
    image: '',
    tags: '',
    featured: false,
    published: true
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = [
    'technology',
    'digitalTransformation',
    'socialJustice',
    'events',
    'innovation',
    'policy',
    'education',
    'startups'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setSelectedFile(file);
    
    try {
      // Convert to base64 for preview
      const base64String = await convertToBase64(file);
      setImagePreview(base64String);
      handleInputChange('image', base64String);
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      alert('Failed to process image');
      setImagePreview('');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUrlChange = (value) => {
    handleInputChange('image', value);
    if (value && !selectedFile) {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title_en || !formData.content_en || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsUploading(true);

      const submitFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'tags' && formData[key]) {
          submitFormData.append(key, formData[key]);
        } else if (key !== 'image') {
          submitFormData.append(key, formData[key]);
        }
      });

      // Handle image - send file if available, otherwise send URL
      if (selectedFile) {
        submitFormData.append('image', selectedFile);
      } else if (formData.image && formData.image.startsWith('http')) {
        submitFormData.append('imageUrl', formData.image);
      } else if (formData.image && formData.image.startsWith('data:')) {
        // Convert base64 back to file for upload
        const response = await fetch(formData.image);
        const blob = await response.blob();
        const file = new File([blob], 'uploaded-image.jpg', { type: blob.type });
        submitFormData.append('image', file);
      }

      const response = await fetch('https://ictforumbackend-5.onrender.com/api/posts', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();
      
      if (result.success) {
        if (onSubmit) {
          onSubmit(result.data);
        }
        // Reset form
        setFormData({
          title_en: '',
          content_en: '',
          excerpt_en: '',
          category: '',
          image: '',
          tags: '',
          featured: false,
          published: true
        });
        setImagePreview('');
        setSelectedFile(null);
        alert('Post created successfully!');
      } else {
        throw new Error(result.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to create post: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setSelectedFile(null);
    handleInputChange('image', '');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="space-y-8">
        {/* Image Upload Section */}
        <div className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center text-xl mb-6">
            <Image className="mr-2 text-blue-600" size={24} />
            Featured Image
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    {isUploading ? 'Processing...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 10MB</p>
                </label>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or paste image URL
                </label>
                <input
                  type="url"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="border rounded-lg overflow-hidden bg-gray-50 h-64 flex items-center justify-center relative">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-400">
                    <Image size={48} className="mx-auto mb-2" />
                    <p>No image selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-blue-700 text-xl font-semibold mb-6">Post Content</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => handleInputChange('title_en', e.target.value)}
                placeholder="Enter compelling post title"
                required
                className="mt-2 w-full text-lg px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt_en}
                onChange={(e) => handleInputChange('excerpt_en', e.target.value)}
                placeholder="Brief description that will appear in post previews"
                rows={3}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Content *
              </label>
              <textarea
                value={formData.content_en}
                onChange={(e) => handleInputChange('content_en', e.target.value)}
                placeholder="Write your full article content here. You can use HTML tags for formatting."
                rows={15}
                required
                className="mt-2 w-full font-mono text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>
          </div>
        </div>

        {/* Post Settings */}
        <div className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-6">
          <div className="flex items-center text-xl mb-6">
            <Save className="mr-2 text-indigo-600" size={24} />
            Post Settings
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="technology, innovation, nepal, digital"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-white rounded-lg border">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <label htmlFor="featured" className="font-medium">Featured Post</label>
                    <p className="text-sm text-gray-500">Show this post prominently on the homepage</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <label htmlFor="published" className="font-medium">Publish Immediately</label>
                    <p className="text-sm text-gray-500">Make this post visible to the public</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button 
            type="button" 
            className="px-8 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <X className="mr-2 inline" size={16} />
            Cancel
          </button>
          <button 
            type="button"
            className="px-8 py-3 border border-blue-300 text-blue-600 bg-white hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Eye className="mr-2 inline" size={16} />
            Preview
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isUploading}
            className={`bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="mr-2 inline" size={16} />
            {isUploading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;