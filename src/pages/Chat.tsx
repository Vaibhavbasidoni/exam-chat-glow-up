
import { useState } from 'react';
import { ArrowRight, Bell, Camera, CheckCircle, FileText, Target, Lightbulb, Bot, Loader2 } from 'lucide-react';
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
  questionNumber: string;
}

interface AnalyzingMessage extends BaseMessage {
  type: 'analyzing';
}

type Message = QuestionMessage | AnswerMessage | FeedbackMessage | AnalyzingMessage;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'question',
      content: 'Complete the sentence by choosing an appropriate option: Avalanche can be caused by',
      options: ['a. new snow or rain', 'b. heavy winds', 'c. high altitude', 'd. global warming'],
      timestamp: '2:55 PM',
      marks: 1,
      questionNumber: '1'
    }
  ]);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [showNextButton, setShowNextButton] = useState(false);

  const dummyQuestions = [
    {
      content: 'Solve the following equation: 3x + 7 = 22. Find the value of x.',
      marks: 2,
      type: 'open'
    },
    {
      content: 'In triangle ABC, if angle A = 60°, angle B = 45°, what is angle C? Show your working.',
      marks: 3,
      type: 'open'
    },
    {
      content: 'Convert the following to Roman numerals:\n(i) 47\n(ii) 129\n(iii) 256',
      marks: 3,
      type: 'open'
    },
    {
      content: 'Choose the correct answer: What is the derivative of f(x) = 3x² + 2x - 1?',
      options: ['a. 6x + 2', 'b. 3x + 2', 'c. 6x - 1', 'd. 3x² + 2'],
      marks: 1,
      type: 'mcq'
    },
    {
      content: 'A rectangle has length 12 cm and width 8 cm. Calculate:\n(i) Its perimeter\n(ii) Its area\n(iii) The length of its diagonal',
      marks: 4,
      type: 'open'
    },
    {
      content: 'Factorize completely: x² - 9x + 20',
      marks: 2,
      type: 'open'
    }
  ];

  const handleSendAnswer = () => {
    if (currentAnswer.trim() || selectedImage) {
      const newMessage: AnswerMessage = {
        id: messages.length + 1,
        type: 'answer',
        content: currentAnswer || 'Image uploaded',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: selectedImage || undefined
      };
      setMessages([...messages, newMessage]);
      setCurrentAnswer('');
      setSelectedImage(null);
      
      // Show analyzing message for images
      if (selectedImage) {
        setTimeout(() => {
          const analyzingMessage: AnalyzingMessage = {
            id: messages.length + 2,
            type: 'analyzing',
            content: 'AI is analyzing your handwritten answer...',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, analyzingMessage]);
        }, 500);
      }
      
      // Simulate feedback after delay
      setTimeout(() => {
        if (selectedImage) {
          setMessages(prev => prev.filter(msg => msg.type !== 'analyzing'));
        }
        
        const feedbackMessage: FeedbackMessage = {
          id: messages.length + 3,
          type: 'feedback',
          content: selectedImage 
            ? 'Your handwritten solution shows good mathematical reasoning and clear working steps.'
            : 'Your answer demonstrates good understanding of the mathematical concepts.',
          marks: { allocated: currentQuestionIndex <= 2 ? 1 : 2, awarded: currentQuestionIndex <= 2 ? 1 : 2 },
          improvement: selectedImage 
            ? 'Excellent work! Your handwriting is clear and your mathematical notation is correct.'
            : 'Well done! Consider showing more detailed steps in your working.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          questionNumber: currentQuestionIndex.toString()
        };
        setMessages(prev => [...prev, feedbackMessage]);
        setShowNextButton(true);
      }, selectedImage ? 3000 : 2000);
    }
  };

  const handleNextQuestion = () => {
    setShowNextButton(false);
    
    if (currentQuestionIndex - 1 < dummyQuestions.length) {
      const nextQuestion = dummyQuestions[currentQuestionIndex - 1];
      const questionMessage: QuestionMessage = {
        id: messages.length + 1,
        type: 'question',
        content: nextQuestion.content,
        options: nextQuestion.options,
        marks: nextQuestion.marks,
        questionNumber: (currentQuestionIndex + 1).toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, questionMessage]);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-inter">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100">
              <ArrowRight className="h-4 w-4 rotate-180 text-blue-600" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                2024 Set 2
              </h1>
              <p className="text-sm text-slate-600 font-medium">Math Test</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100">
              <Bell className="h-4 w-4 text-slate-600" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
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
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale" style={{ borderLeft: '4px solid #3F2768' }}>
                  <CardContent className="p-5">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3F2768' }}>
                          <span className="text-white text-xs font-bold">Q</span>
                        </div>
                        <span className="font-bold" style={{ color: '#3F2768' }}>
                          ({(message as QuestionMessage).questionNumber}) ({(message as QuestionMessage).marks} mark{(message as QuestionMessage).marks > 1 ? 's' : ''})
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-line">{message.content}</p>
                    </div>
                    
                    {(message as QuestionMessage).options && (
                      <div className="space-y-3">
                        {(message as QuestionMessage).options!.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#3F2768' }}></div>
                            <span className="text-slate-700 font-medium">{option}</span>
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
                      <p className="text-sm leading-relaxed font-medium">{message.content}</p>
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

              {message.type === 'analyzing' && (
                <div className="flex justify-center animate-scale-in">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl shadow-lg border-amber-200 border">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
                      <Bot className="h-5 w-5 text-amber-600" />
                      <p className="text-amber-800 font-medium">{message.content}</p>
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'feedback' && (
                <div className="space-y-4">
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg animate-scale-in">
                    <CardContent className="p-5">
                      {/* Question Number and Marks Header */}
                      <div className="bg-white/60 rounded-lg p-3 mb-4 border-l-4 border-green-400">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-slate-700">Question Number:</span>
                            <span className="ml-2 text-slate-800 font-bold">{(message as FeedbackMessage).questionNumber}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">Marks Allocated:</span>
                            <span className="ml-2 text-slate-800 font-bold">{(message as FeedbackMessage).marks.allocated}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">Marks Awarded:</span>
                            <span className="ml-2 text-green-700 font-bold">{(message as FeedbackMessage).marks.awarded}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">Student Answer:</span>
                            <span className="ml-2 text-slate-800 font-bold">Completed</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-green-800 mb-1">Feedback:</h4>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-lg border-l-4 border-green-400">
                          <p className="text-slate-700 text-sm leading-relaxed font-medium">{message.content}</p>
                        </div>
                        
                        {(message as FeedbackMessage).improvement && (
                          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-400">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="font-bold text-amber-800 text-sm">Improvement Suggestion:</h5>
                                <p className="text-amber-700 text-sm mt-1 font-medium">{(message as FeedbackMessage).improvement}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-green-600 mt-3 text-right font-medium">{message.timestamp}</p>
                    </CardContent>
                  </Card>

                  {/* Next Question Button */}
                  {showNextButton && currentQuestionIndex <= dummyQuestions.length && (
                    <div className="flex justify-center animate-fade-in">
                      <Button 
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                      >
                        <span className="mr-2">Next Question</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4">
        <div className="max-w-md mx-auto space-y-3">
          {selectedImage && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <Camera className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Image selected</span>
              </div>
              <img src={selectedImage} alt="Selected answer" className="w-full h-32 object-cover rounded-lg" />
            </div>
          )}
          
          {!selectedImage && (
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[60px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none font-medium"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendAnswer()}
            />
          )}
          
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
              className="h-10 w-10 border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-110 transition-all duration-200"
              asChild
            >
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="h-4 w-4 text-slate-600" />
              </label>
            </Button>
            
            <div className="flex-1" />
            
            <Button 
              onClick={handleSendAnswer}
              className="h-10 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              disabled={!currentAnswer.trim() && !selectedImage}
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
