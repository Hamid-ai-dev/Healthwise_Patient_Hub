
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AtSign, Lock } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }
    
    // Reset form error
    setFormError('');
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      setFormError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-healwise-blue to-healwise-green">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Login to your HealWise account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password"
                      className="text-sm text-healwise-blue hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                
                {formError && (
                  <div className="text-red-500 text-sm mt-1">{formError}</div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-healwise-blue hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="flex items-center">
                <Separator className="flex-1" />
                <div className="px-2 text-xs text-gray-500">OR CONTINUE WITH</div>
                <Separator className="flex-1" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-2">
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" fill="#4285F4"/>
                    <path d="M4.17 12.958l-.823 2.66l-2.71.057a8.955 8.955 0 0 1-.659-8.364l2.454.448l1.033 2.346a5.339 5.339 0 0 0 .705 2.853z" fill="#34A853"/>
                    <path d="M12.207 5.519c.735 0 1.451.144 2.104.407l2.599-2.599C15.322 2.19 13.29 1.337 11.016 1.337a8.907 8.907 0 0 0-7.866 4.701l3.476 2.84c.905-2.154 2.952-3.36 5.581-3.36z" fill="#EA4335"/>
                    <path d="M12.207 19.816c2.475 0 4.342-1.26 4.769-3.453h-4.769v-3.451h8.327c.121.528.202 1.097.202 1.625 0 5.685-4.062 8.934-8.529 8.934-2.437 0-4.595-1.027-6.168-2.693L2.8 16.612c1.584 3.106 4.863 5.203 8.417 5.203z" fill="#FBBC05"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.238-.02-.356-.03-.05-.24-.06-.48-.06-.73 0-1.04.42-2.11 1.18-2.82.75-.7 1.93-1.27 2.98-1.33.03.19.04.38.04.57c0 .25-.01.5-.04.74.05 0 .09-.01.144-.01zm-6.89 14.2v4.05c0 1.36.5 2.54 1.84 3.13a9.76 9.76 0 01-2.85.38c-.12 0-.21-.02-.35-.03-1.06-.11-2.2-.56-2.86-1.25-.63-.67-1.17-1.81-1.17-2.87 0-.24.05-.46.09-.7.16-.92.68-1.76 1.39-2.52.71-.76 1.65-1.46 2.91-2.05v1.86h.01z"/>
                  </svg>
                  Apple
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-healwise-blue hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Accounts</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>Patient:</strong> john@example.com (any password)</p>
              <p><strong>Doctor:</strong> sarah@example.com (any password)</p>
              <p><strong>Admin:</strong> admin@example.com (any password)</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
