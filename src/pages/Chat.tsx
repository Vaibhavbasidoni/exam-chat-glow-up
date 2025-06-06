

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Bell,
  Camera,
  CheckCircle,
  FileText,
  Loader2,
  Bot,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BaseMessage {
  id: number;
  type: string;
  content: string;
  timestamp: string;
}

interface QuestionMessage extends BaseMessage {
  type: 'question';
  marks: number;
  questionNumber: string;
  subQuestions: string[];
}

interface AnswerMessage extends BaseMessage {
  type: 'answer';
  image?: string;
}

interface SubFeedback {
  questionNumber: number;
  allocated: number;
  awarded: number;
  studentAnswer: string;
  feedbackText: string;
}

interface FeedbackMessage extends BaseMessage {
  type: 'feedback';
  subFeedbacks: SubFeedback[];
  combinedImprovements: string;
  totalAllocated: number;
  totalAwarded: number;
}

interface AnalyzingMessage extends BaseMessage {
  type: 'analyzing';
}

type Message = QuestionMessage | AnswerMessage | FeedbackMessage | AnalyzingMessage;

const allQuestions: Omit<QuestionMessage, 'id' | 'type' | 'timestamp'>[] = [
  {
    questionNumber: '1',
    marks: 10,
    subQuestions: [
      '(i) Complete the sentence by choosing an appropriate option: Avalanche can be caused by\n• a. new snow or rain\n• b. heavy winds\n• c. high altitude\n• d. global warming',
      '(ii) Comment on warning signs which allow experts to predict avalanches in two sentences.',
      '(iii) Mention two reasons which destroyed the natural scenery.',
      '(iv) Select the option that conveys the opposite of "massive":\n• a. tiny\n• b. lengthy\n• c. bulky\n• d. extensive',
      '(v) The writer will agree with one of the given statements (paragraph 4):\n• a. People caught in an avalanche can try to swim to the top.\n• b. Put on an oxygen mask.\n• c. Digging is not possible.\n• d. Should not come close to the surface.',
      '(vi) Select the option that corresponds to the following relation: "Snow : Avalanche :: Water : ___"\n• a. Flood\n• b. Drought\n• c. Tsunami\n• d. Waterfall',
    ],
    content: `📖 Section A — Question 1  
✏️ Type: Reading Comprehension  
🎯 Marks: 10  

Instruction: Read the following passage carefully:  

📚 Passage:  
(1) If you're like most kids, you may love snow. Not only can it get you out of school, but it's also fun to play with. Who doesn't love to sled and build snowmen? Snow can also be dangerous, too. You may have heard your parents talk about how difficult it can be to drive in snow. Car accidents aren't the only dangers created by snow. If you're ever skiing in the mountains, you'll want to be aware of avalanches. An avalanche is a sudden flow of snow down a slope, such as a mountain. The amount of snow in an avalanche will vary based on many things, but it can be such a huge pile that it can bury the bottom of a slope in dozens of feet of snow.  

(2) Avalanches can be caused by many things. Some of them are natural. For example, new snow or rain can cause built-up snow to loosen and fall down the side of a mountain. Earthquakes and the movement of animals have also been known to cause avalanches. Artificial triggers can also cause avalanches. For instance, skiers and snowboarders can sometimes accidentally cause an avalanche when they break through a weak layer of snow.  

Below are sub-questions (i)–(vi) based on this passage:`,
  },
  {
    questionNumber: '2',
    marks: 8,
    subQuestions: [
      '(i) According to paragraph (1), what three attributes are essential for a young person to pursue a successful tech career?',
      '(ii) In your own words, summarize how high school students can begin building a coding portfolio (paragraph 2).',
      '(iii) Identify two benefits of internships mentioned in paragraph (3).',
      '(iv) Explain why "mentors and peers" are considered crucial in paragraph (2), based on the text.',
    ],
    content: `📖 Section A — Question 2  
✏️ Type: Reading Comprehension  
🎯 Marks: 8  

Instruction: Read the following passage carefully:  

📚 Passage:  
(1) Many young people dream of a career in technology. They imagine coding apps that solve problems, designing robots to do household chores, or pioneering new breakthroughs in artificial intelligence. But the journey to a tech career requires more than just imagination. It takes discipline, a willingness to learn from failure, and a team that can support you when things get tough.  

(2) In high school, students might begin by taking introductory classes in computer science, learning the basics of algorithms, data structures, problem-solving. As their skills grow, they can work on personal coding projects—perhaps a small game or a simple web application—to build a portfolio. Mentors and peers help provide feedback, debugging tips, and moral support, reminding students that even the best programmers started with errors.  

(3) Once in college, the focus often shifts to more specialized areas—cybersecurity, machine learning, or human-computer interaction. Internships during summer breaks offer real-world experience: writing production-level code, collaborating with engineers, and participating in code reviews. Those internships can lead to full-time offers if the student demonstrates creativity, critical thinking, and a strong work ethic.  

Below are sub-questions (i)–(iv) based on this passage:`,
  },
  {
    questionNumber: '3',
    marks: 12,
    subQuestions: [
      '(i) Solve the equation: 2x + 5 = 17',
      '(ii) Find the area of a rectangle with length 8 cm and width 5 cm.',
      '(iii) Calculate: (3 + 4) × 2 - 6',
      '(iv) What is 25% of 80?',
      '(v) Convert 3.5 hours into minutes.',
      '(vi) If a triangle has angles of 60° and 70°, what is the third angle?',
    ],
    content: `📖 Section A — Question 3  
✏️ Type: Mathematics  
🎯 Marks: 12  

Instruction: Solve the following mathematical problems:  

Show your working clearly for each calculation.  

Below are sub-questions (i)–(vi) to solve:`,
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('📋');
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const first = allQuestions[0];
    const questionMessage: QuestionMessage = {
      id: 1,
      type: 'question',
      content: first.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      marks: first.marks,
      questionNumber: first.questionNumber,
      subQuestions: first.subQuestions,
    };
    setMessages([questionMessage]);
  }, []);

  useEffect(() => {
    const totalQuestions = allQuestions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    setCurrentProgress(progress);
  }, [currentQuestionIndex]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
    };
    reader.readAsDataURL(file);
    // Reset the input value to allow re-uploading the same file or different files
    event.target.value = '';
  };

  const handleSendAnswer = () => {
    if (isSubmitting) return;
    if (!selectedImage) return;

    setIsSubmitting(true);
    const studentAnswerImage = selectedImage;

    const answerMessage: AnswerMessage = {
      id: messages.length + 1,
      type: 'answer',
      content: 'Image uploaded',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: studentAnswerImage!,
    };
    setMessages((prev) => [...prev, answerMessage]);
    setSelectedImage(null);

    const analyzingMsg: AnalyzingMessage = {
      id: messages.length + 2,
      type: 'analyzing',
      content: 'AI is analyzing your handwritten answers…',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, analyzingMsg]);
    }, 300);

    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.type !== 'analyzing'));

      const currentQ = allQuestions[currentQuestionIndex];
      const subCount = currentQ.subQuestions.length;
      const totalMarks = currentQ.marks;

      const base = Math.floor(totalMarks / subCount);
      const remainder = totalMarks % subCount;
      const marksDistribution: number[] = [];
      for (let i = 0; i < subCount; i++) {
        marksDistribution.push(i < remainder ? base + 1 : base);
      }

      const dummyAnswers = [
        'A thin layer of fresh snow resting on an older, unstable base.',
        'Hearing cracks and seeing snow melt can signal instability.',
        'Construction and deforestation removed natural barriers.',
        'tiny (direct opposite of massive).',
        '"People caught in an avalanche can try to swim to the top." is correct.',
        'Flood mimics the sudden surge, matching the analogy best.',
      ];
      const variedFeedbacks = [
        'Excellent choice—new snow or rain indeed disrupts the existing snowpack and can trigger an avalanche.',
        'Well noted. Describing sounds like cracking accurately indicates a weakening snow structure.',
        'Good insight. You recognized how removal of trees and road construction destroyed natural scenery.',
        'Correct antonym. "tiny" effectively conveys the opposite of "massive."',
        'Perfect interpretation. That statement does reflect the author\'s advice for survival.',
        'Spot on. Flood captures the rapid and forceful movement similar to how water relates to tsunami or drought.',
      ];

      const subFeedbacks: SubFeedback[] = [];
      const improvementLines: string[] = [
        'Tip for Q1: Double-check the broader passage context before finalizing your choice.',
        'Tip for Q2: Add a sentence on how someone might respond once they notice these signs.',
        'Tip for Q3: Include real examples like highways or ski resorts that altered scenery.',
        'Tip for Q4: Verify synonyms in a dictionary to ensure precise antonym usage.',
        'Tip for Q5: Reference the exact line where this advice appears for stronger support.',
        'Tip for Q6: Discuss why "drought" or "tsunami" would not fit the analogy as well as "flood."',
      ];
      let cumulativeAwarded = 0;

      currentQ.subQuestions.forEach((subQ, idx) => {
        const allocated = marksDistribution[idx];
        const awarded = allocated;
        cumulativeAwarded += awarded;
        subFeedbacks.push({
          questionNumber: idx + 1,
          allocated,
          awarded,
          studentAnswer: dummyAnswers[idx],
          feedbackText: `<strong>${variedFeedbacks[idx]}</strong>`,
        });
      });

      const combinedImprovements = improvementLines.join('\n\n');

      const combinedFeedback: FeedbackMessage = {
        id: messages.length + 3,
        type: 'feedback',
        subFeedbacks,
        combinedImprovements,
        totalAllocated: totalMarks,
        totalAwarded: cumulativeAwarded,
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, combinedFeedback]);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= allQuestions.length) {
      alert('🎉 Congratulations! You have completed all questions!');
      return;
    }

    setSelectedImage(null);
    setShowImprovements(false);
    const nextQ = allQuestions[nextIndex];
    const questionMessage: QuestionMessage = {
      id: messages.length + 1,
      type: 'question',
      content: nextQ.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      marks: nextQ.marks,
      questionNumber: nextQ.questionNumber,
      subQuestions: nextQ.subQuestions,
    };
    setMessages((prev) => [...prev, questionMessage]);
    setCurrentQuestionIndex(nextIndex);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback('✅');
    setTimeout(() => setCopyFeedback('📋'), 2000);
  };

  // Check if we should show the Next button - only after feedback with summary is shown
  const shouldShowNextButton = () => {
    const lastFeedback = messages.filter(m => m.type === 'feedback').pop();
    return lastFeedback && messages.some(m => m.type === 'feedback');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-inter">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4 rotate-180 text-blue-600" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-[#3F2768]">2024 Set 2</h1>
              <p className="text-sm text-slate-600 font-medium">Math Test</p>
              {/* Progress Bar */}
              <div className="w-20 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#3F2768] to-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4 text-slate-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-bold">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Tag - Fixed width to match other cards */}
      <div className="max-w-md mx-auto p-4 pt-4">
        <Card className="bg-gradient-to-r from-[#3F2768] to-[#4A2B7A] border-0 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Questions</CardTitle>
              <div className="ml-auto text-white/80 text-sm font-medium">
                {currentQuestionIndex + 1}/{allQuestions.length}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Chat Content */}
      <div className="max-w-md mx-auto p-4 pt-2 pb-32 space-y-6">
        {messages.map((message, idx) => (
          <div
            key={message.id}
            className="space-y-4 animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {message.type === 'question' && (
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl border-l-4 border-[#3F2768]">
                <CardContent className="p-5">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#3F2768' }}
                      >
                        <span className="text-white text-xs font-bold">Q</span>
                      </div>
                      <span className="font-bold" style={{ color: '#3F2768' }}>
                        ({(message as QuestionMessage).questionNumber}) (
                        {(message as QuestionMessage).marks} Mark
                        {(message as QuestionMessage).marks > 1 ? 's' : ''})
                      </span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                      {(message as QuestionMessage).content}
                    </p>
                  </div>
                  {(message as QuestionMessage).subQuestions.map((sub, i) => (
                    <div key={i} className="pl-4 mb-2 p-2">
                      <span className="font-medium text-slate-700">{sub}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {message.type === 'answer' && (
              <div className="flex justify-end animate-slide-in-right">
                <div className="max-w-xs">
                  <div className="bg-gradient-to-r from-[#3F2768] to-[#4A2B7A] text-white p-4 rounded-2xl rounded-br-md shadow-xl whitespace-pre-line">
                    <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                    {message.image && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <img src={message.image} alt="Uploaded answer" className="w-full h-auto" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-right">{message.timestamp}</p>
                </div>
              </div>
            )}

            {message.type === 'analyzing' && (
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl shadow-lg border-amber-200 border flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
                  <Bot className="h-5 w-5 text-amber-600" />
                  <p className="text-amber-800 font-medium">{message.content}</p>
                </div>
              </div>
            )}

            {message.type === 'feedback' && (
              <>
                <Card className="bg-gradient-to-br from-[#F0EDF7] to-[#E8E4F2] border-[#B0A6C9] shadow-xl">
                  <CardContent className="p-5">
                    {/* Header with Feedback icon */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-[#3F2768] rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-[#3F2768] text-lg">Feedback</h4>
                      <span
                        onClick={() =>
                          copyToClipboard(
                            message.subFeedbacks
                              .map(
                                (f) =>
                                  `Question ${f.questionNumber}\nMarks Awarded: ${f.awarded}\nMarks Allocated: ${f.allocated}\nStudent Answer: ${f.studentAnswer}\nFeedback: ${f.feedbackText.replace(/<[^>]+>/g, '')}`
                              )
                              .join('\n\n')
                          )
                        }
                        className="cursor-pointer text-[#3F2768] transition-all duration-200 text-lg"
                        title="Copy all feedback"
                      >
                        {copyFeedback}
                      </span>
                    </div>

                    {/* sub-feedback blocks */}
                    <div className="space-y-4 mb-3">
                      {message.subFeedbacks.map((fb, fbIdx) => (
                        <div
                          key={fb.questionNumber}
                          className="bg-white/70 rounded-lg p-3 border-l-4 border-[#3F2768] shadow-inner"
                          style={{ animationDelay: `${fbIdx * 0.1}s` }}
                        >
                          <p className="text-[#3F2768] text-sm font-semibold">Question {fb.questionNumber}</p>
                          <div className="flex justify-between mt-1">
                            <span>
                              <span className="text-[#3F2768] text-xs font-bold">Marks Awarded:</span>{' '}
                              <span className={`text-xs font-semibold ${fb.awarded === fb.allocated ? 'text-[#28A745]' : 'text-[#D0342C]'}`}>
                                {fb.awarded}
                              </span>
                            </span>
                            <span>
                              <span className="text-[#28A745] text-xs font-bold">Marks Allocated:</span>{' '}
                              <span className="text-[#3F2768] text-xs">{fb.allocated}</span>
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-[#3F2768] text-sm font-bold">Student Answer:</span>{' '}
                            <span className="text-[#3F2768] text-sm">{fb.studentAnswer}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-[#3F2768] text-sm font-bold">Feedback:</span>{' '}
                            <span className="text-[#3F2768] text-sm" dangerouslySetInnerHTML={{ __html: fb.feedbackText }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* toggle for improvement tips */}
                    <button
                      onClick={() => setShowImprovements((prev) => !prev)}
                      className="mb-2 text-xs text-[#3F2768] font-semibold"
                    >
                      {showImprovements ? (
                        <span className="flex items-center gap-1">
                          <span>Hide Tips</span> ⬆️
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <span>Show Tips</span> ⬇️
                        </span>
                      )}
                    </button>

                    {/* improvement tips section */}
                    <div
                      className={`p-3 bg-[#F5F3FA] rounded-lg border-l-4 border-[#B0A6C9] overflow-hidden transition-all duration-500 whitespace-pre-line ${
                        showImprovements ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-6 w-6 text-[#3F2768] mt-0.5" />
                        <div>
                          <h5 className="font-bold text-[#3F2768] text-sm mb-1">Improvement Tips:</h5>
                          <p className="text-[#5A4E75] text-sm font-medium">{message.combinedImprovements}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#3F2768] mt-3 text-right font-medium">{message.timestamp}</p>
                  </CardContent>
                </Card>

                {/* Summary */}
                <div className="max-w-md mx-auto mt-2 p-4 bg-gradient-to-r from-white/95 to-purple-50/95 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg">
                  <p className="text-[#3F2768] font-bold whitespace-pre-line text-center">
                    🎯 Total Marks Awarded: {message.totalAwarded}/{message.totalAllocated}
                    {'\n'}✅ Completeness Status: Completed
                  </p>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Next Button - Only show after feedback summary is complete */}
        {shouldShowNextButton() && (
          <div className="flex justify-center">
            <Button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-[#3F2768] to-[#4A2B7A] text-white shadow-xl"
            >
              <span className="mr-2">Next Question</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto space-y-3">
          {selectedImage && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Camera className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">📸 Image selected and ready!</span>
              </div>
              <img 
                src={selectedImage} 
                alt="Selected answer" 
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
              />
            </div>
          )}
          {!selectedImage && (
            <Textarea
              value={''}
              placeholder="📷 Upload an image to get feedback for all sub-questions"
              className="min-h-[60px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none font-medium opacity-75"
              disabled
            />
          )}

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isSubmitting}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-slate-200"
              asChild
              disabled={isSubmitting}
            >
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="h-4 w-4 text-slate-600" />
              </label>
            </Button>

            <div className="flex-1" />

            <Button
              onClick={handleSendAnswer}
              className="bg-gradient-to-r from-[#3F2768] to-[#4A2B7A] shadow-xl font-semibold text-white"
              disabled={!selectedImage || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-white mr-2" />
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">Send</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

