
import { useState } from 'react';
import { ArrowRight, Bell, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'question',
      content: 'Complete the sentence by choosing an appropriate option: Avalanche can be caused by',
      options: ['a. new snow or rain', 'b. heavy winds', 'c. high altitude', 'd. global warming'],
      timestamp: '2:55 PM'
    },
    {
      id: 2,
      type: 'question',
      content: 'Comment on warning signs exist which allow experts to predict avalanches in two sentences.',
      timestamp: '2:55 PM'
    }
  ]);
  
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleSendAnswer = () => {
    if (currentAnswer.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'answer',
        content: currentAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setCurrentAnswer('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-800">2023 Set 1</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        <div className="space-y-4">
          {/* Question Header Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">?</span>
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Questions:</CardTitle>
              </div>
            </CardHeader>
          </Card>

          {/* Messages */}
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-3">
              {message.type === 'question' && (
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <span className="font-semibold text-slate-800">
                        ({String.fromCharCode(105 + index)}) (1 mark)
                      </span>
                      <span className="ml-2 text-slate-700">{message.content}</span>
                    </div>
                    
                    {message.options && (
                      <div className="space-y-2">
                        {message.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-start gap-2">
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-700">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {message.type === 'answer' && (
                <div className="flex justify-end">
                  <div className="max-w-xs">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-2xl rounded-br-md">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-right">{message.timestamp}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400">
              <div className="w-5 h-5 border-2 border-current rounded"></div>
            </Button>
            <div className="flex-1 relative">
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="pr-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendAnswer()}
              />
            </div>
            <Button 
              onClick={handleSendAnswer}
              size="icon" 
              className="h-10 w-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-slate-200">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
