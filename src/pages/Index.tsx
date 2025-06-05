
import { useState } from 'react';
import { Bell, Home, Library, BarChart3, User, Play, RotateCcw, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Good Morning, Sarah</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-slate-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Continue Journey Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Continue Your Journey</h2>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔥</span>
                  </div>
                  <span className="text-sm">5 days streak</span>
                </div>
              </div>
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent" 
                     style={{ transform: 'rotate(245deg)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold">68%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4">
          <Link to="/chat" className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-shadow">
              <Play className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Practice Test</span>
          </Link>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Review</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Flashcards</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Analytics</span>
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Your Progress</h3>
            <Button variant="ghost" className="text-slate-600 text-sm">View All</Button>
          </div>
          
          <div className="mb-4">
            <Progress value={67} className="h-2" />
            <p className="text-sm text-slate-600 mt-2">12 of 18 topics completed</p>
          </div>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">📊</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Mathematics</h4>
                      <p className="text-sm text-slate-600">24 questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">85%</span>
                    <div className="w-4 h-4 text-slate-400">→</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">🧪</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Science</h4>
                      <p className="text-sm text-slate-600">18 questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">62%</span>
                    <div className="w-4 h-4 text-slate-400">→</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-sm">📚</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">English</h4>
                      <p className="text-sm text-slate-600">21 questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">74%</span>
                    <div className="w-4 h-4 text-slate-400">→</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <Home className="h-5 w-5 text-purple-600" />
            <span className="text-xs text-purple-600 mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center">
            <Play className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-slate-400 mt-1">Practice</span>
          </div>
          <div className="flex flex-col items-center">
            <BarChart3 className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-slate-400 mt-1">Progress</span>
          </div>
          <div className="flex flex-col items-center">
            <Library className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-slate-400 mt-1">Library</span>
          </div>
          <div className="flex flex-col items-center">
            <User className="h-5 w-5 text-slate-400" />
            <span className="text-xs text-slate-400 mt-1">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
