
import { useState } from 'react';
import { ArrowRight, Bell, Camera, CheckCircle, XCircle, FileText, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface BaseMessage {
  id: number;
  type: string;
  content: string;
  timestamp: string;
}

interface QuestionMessage extends BaseMessage {
  type: 'question';
  options?: string[];
  marks: number;
  questionNumber: string;
}

interface AnswerMessage extends BaseMessage {
  type: 'answer';
  image?: string;
}

interface FeedbackMessage extends BaseMessage {
  type: 'feedback';
  marks: { allocated: number; awarded: number };
  improvement?: string;
}

type Message = QuestionMessage | AnswerMessage | FeedbackMessage;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'question',
      content: 'Complete the sentence by choosing an appropriate option: Avalanche can be caused by',
      options: ['a. new snow or rain', 'b. heavy winds', 'c. high altitude', 'd. global warming'],
      timestamp: '2:55 PM',
      marks: 1,
      questionNumber: 'i'
    },
    {
      id: 2,
      type: 'answer',
      content: 'a. new snow or rain',
      timestamp: '2:56 PM'
    },
    {
      id: 3,
      type: 'feedback',
      content: 'Your answer correctly identifies the reasons for avalanche formation based on the passage.',
      marks: { allocated: 1, awarded: 1 },
      improvement: 'Well done!',
      timestamp: '2:56 PM'
    },
    {
      id: 4,
      type: 'question',
      content: 'Comment on warning signs exist which allow experts to predict avalanches in two sentences.',
      timestamp: '2:57 PM',
      marks: 1,
      questionNumber: 'ii'
    }
  ]);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSendAnswer = () => {
    if (currentAnswer.trim()) {
      const newMessage: AnswerMessage = {
        id: messages.length + 1,
        type: 'answer',
        content: currentAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: selectedImage || undefined
      };
      setMessages([...messages, newMessage]);
      setCurrentAnswer('');
      setSelectedImage(null);
      
      // Simulate feedback after 2 seconds
      setTimeout(() => {
        const feedbackMessage: FeedbackMessage = {
          id: messages.length + 2,
          type: 'feedback',
          content: 'Your answer demonstrates good understanding of the topic.',
          marks: { allocated: 1, awarded: 1 },
          improvement: 'Consider adding more specific examples to strengthen your response.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, feedbackMessage]);
      }, 2000);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100">
              <ArrowRight className="h-4 w-4 rotate-180 text-blue-600" />
            </Button>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              2023 Set 1
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100">
              <Bell className="h-4 w-4 text-slate-600" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-w-md mx-auto p-4 pb-32">
        <div className="space-y-6">
          {/* Question Header Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg animate-fade-in">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Questions</CardTitle>
              </div>
            </CardHeader>
          </Card>

          {/* Messages */}
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {message.type === 'question' && (
                <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                  <CardContent className="p-5">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Q</span>
                        </div>
                        <span className="font-bold text-blue-800">
                          ({(message as QuestionMessage).questionNumber}) ({(message as QuestionMessage).marks} mark)
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{message.content}</p>
                    </div>
                    
                    {(message as QuestionMessage).options && (
                      <div className="space-y-3">
                        {(message as QuestionMessage).options!.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {message.type === 'answer' && (
                <div className="flex justify-end animate-slide-in-right">
                  <div className="max-w-xs">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 rounded-2xl rounded-br-md shadow-lg">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {(message as AnswerMessage).image && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img src={(message as AnswerMessage).image} alt="Uploaded answer" className="w-full h-auto" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-right">{message.timestamp}</p>
                  </div>
                </div>
              )}

              {message.type === 'feedback' && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg animate-scale-in">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-800 mb-1">Feedback</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-green-700">
                              {(message as FeedbackMessage).marks.awarded}/{(message as FeedbackMessage).marks.allocated} marks
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-white/50 rounded-lg border-l-4 border-green-400">
                        <p className="text-slate-700 text-sm leading-relaxed">{message.content}</p>
                      </div>
                      
                      {(message as FeedbackMessage).improvement && (
                        <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-400">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-amber-800 text-sm">Improvement Suggestion</h5>
                              <p className="text-amber-700 text-sm mt-1">{(message as FeedbackMessage).improvement}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-green-600 mt-3 text-right">{message.timestamp}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4">
        <div className="max-w-md mx-auto space-y-3">
          {selectedImage && (
            <div className="relative">
              <img src={selectedImage} alt="Selected" className="w-full h-32 object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setSelectedImage(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[60px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendAnswer()}
          />
          
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
              asChild
            >
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="h-4 w-4 text-slate-600" />
              </label>
            </Button>
            
            <div className="flex-1" />
            
            <Button 
              onClick={handleSendAnswer}
              className="h-10 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={!currentAnswer.trim()}
            >
              <span className="mr-2">Send</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
