import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  onLogin: (userData: any, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.email === 'admin@ictforumnepal.org' && formData.password === 'admin123') {
        const mockUserData = {
          id: '1',
          name: 'Admin User',
          email: formData.email,
          role: 'admin'
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        setTimeout(() => {
          onLogin(mockUserData, mockToken);
        }, 1500);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setError('Invalid email or password. Use admin@ictforumnepal.org / admin123 for demo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-400/10 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-purple-400/10 rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src="/assets/images/WhatsApp Image 2025-09-26 at 8.50.23 PM (1).jpeg"
              alt="ICT Forum Nepal"
              className="h-20 w-20 mx-auto rounded-full object-cover border-4 border-white shadow-2xl mb-6"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={16} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Sparkles className="mr-2 text-yellow-400" size={32} />
            Admin Portal
          </h1>
          <p className="text-blue-200 text-lg">ICT Forum Nepal Management</p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-teal-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Secure Login
            </CardTitle>
            <p className="text-gray-600 text-sm">Access your admin dashboard</p>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@ictforumnepal.org"
                    className="pl-12 py-3 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 py-3 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Shield className="mr-2" size={20} />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-center">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center justify-center">
                  <Sparkles className="mr-2 text-blue-600" size={16} />
                  Demo Credentials
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white/70 px-3 py-2 rounded-lg">
                    <strong className="text-blue-800">Email:</strong> admin@ictforumnepal.org
                  </div>
                  <div className="bg-white/70 px-3 py-2 rounded-lg">
                    <strong className="text-blue-800">Password:</strong> admin123
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  Use these credentials to explore the admin dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2024 ICT Forum Nepal. Secure Admin Access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;