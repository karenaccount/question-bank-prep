import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Calendar,
  FileText,
  CheckCircle,
  RotateCcw
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const WrongAnswersBook = () => {
  const { user } = useAuth();
  const { wrongAnswers, removeFromWrongAnswers, clearWrongAnswers } = useQuiz();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const userWrongAnswers = wrongAnswers.filter(item => item.userId === user?.id);

  // Filter wrong answers
  const filteredWrongAnswers = userWrongAnswers.filter(item => {
    const matchesSearch = item.question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quizName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" || item.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects for filter
  const uniqueSubjects = [...new Set(userWrongAnswers.map(item => item.subject))];

  const handleRemoveFromWrongAnswers = (questionId: string) => {
    removeFromWrongAnswers(questionId);
  };

  const handleClearAll = () => {
    if (window.confirm("确定要清空所有错题吗？此操作不可撤销。")) {
      clearWrongAnswers();
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'single-choice': '单选题',
      'multiple-choice': '多选题',
      'true-false': '判断题',
      'short-answer': '简答题',
      'essay': '论述题'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              错题本
            </h1>
            <p className="text-muted-foreground mt-2">
              复习做错的题目，巩固知识点
            </p>
          </div>
          <div className="flex gap-2">
            {userWrongAnswers.length > 0 && (
              <Button variant="destructive" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                清空错题本
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate(-1)}>
              返回
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">搜索</label>
                <div className="relative">
                  <Input
                    placeholder="搜索题目内容或试卷名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">学科</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择学科" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部学科</SelectItem>
                    {uniqueSubjects.map((subject: string) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">时间</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部时间</SelectItem>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="week">本周</SelectItem>
                    <SelectItem value="month">本月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wrong Answers List */}
        <div className="space-y-4">
          {filteredWrongAnswers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">暂无错题</h3>
                <p className="text-muted-foreground">
                  {searchQuery || subjectFilter !== "all" || timeFilter !== "all"
                    ? "没有符合筛选条件的错题"
                    : "您还没有做错的题目，继续保持！"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredWrongAnswers.map((wrongAnswer) => (
              <Card key={wrongAnswer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Question Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">
                            {getQuestionTypeLabel(wrongAnswer.question.type)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            来自试卷：{wrongAnswer.quizName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {wrongAnswer.addedAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {wrongAnswer.subject}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromWrongAnswers(wrongAnswer.questionId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">题目：</h4>
                        <p className="text-foreground">{wrongAnswer.question.content}</p>
                      </div>

                      {/* Options for choice questions */}
                      {(wrongAnswer.question.type === 'single-choice' || wrongAnswer.question.type === 'multiple-choice') && (
                        <div>
                          <h4 className="font-medium mb-2">选项：</h4>
                          <div className="space-y-1">
                            {wrongAnswer.question.options?.map((option: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm">
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">您的答案：</h4>
                          <p className="text-red-600 bg-red-50 p-2 rounded">
                            {wrongAnswer.studentAnswer}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">正确答案：</h4>
                          <p className="text-green-600 bg-green-50 p-2 rounded">
                            {wrongAnswer.question.correctAnswer}
                          </p>
                        </div>
                      </div>

                      {/* Explanation */}
                      {wrongAnswer.question.explanation && (
                        <div>
                          <h4 className="font-medium mb-2">解析：</h4>
                          <p className="text-muted-foreground bg-blue-50 p-3 rounded">
                            {wrongAnswer.question.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/quiz/${wrongAnswer.quizId}`)}>
                        查看原试卷
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        重新练习
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WrongAnswersBook;