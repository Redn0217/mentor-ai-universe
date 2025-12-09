import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, BookOpen, CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseSidebarProps {
  course: any;
  currentModuleId: string;
  currentLessonId: string;
  completedLessons: Set<string>;
  courseSlug: string;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  currentModuleId,
  currentLessonId,
  completedLessons,
  courseSlug
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([currentModuleId])
  );

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleLessonClick = (moduleId: string, lessonIndex: number) => {
    if (moduleId !== currentModuleId) {
      setExpandedModules(prev => new Set(prev).add(moduleId));
    }
    navigate(`/course/${courseSlug}/module/${moduleId}?lesson=${lessonIndex}`);
  };

  if (!course?.modules) return null;

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0 transition-all duration-300",
        isOpen ? "w-80" : "w-0"
      )}>
        <div className={cn("w-80", !isOpen && "hidden")}>
          {/* Course Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <h2 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h2>
              <p className="text-sm text-gray-600">
                {course.modules.length} Module{course.modules.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

      {/* Modules List */}
      <div className="py-2">
        {course.modules.map((module: any, moduleIndex: number) => {
          const isExpanded = expandedModules.has(module.id);
           const isCurrentModule = module.id === currentModuleId;
          const moduleLessons = module.lessons || [];
          const completedCount = moduleLessons.filter((lesson: any) =>
            completedLessons.has(lesson.id)
          ).length;
          const totalLessons = moduleLessons.length;

          return (
            <div key={module.id} className="border-b border-gray-100">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isExpanded ? (
                    <ChevronDown className={cn(
                      "w-5 h-5",
                      isCurrentModule ? "text-blue-600" : "text-gray-600"
                    )} />
                  ) : (
                    <ChevronRight className={cn(
                      "w-5 h-5",
                      isCurrentModule ? "text-blue-600" : "text-gray-600"
                    )} />
                  )}
                </div>

                {/* Module Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-semibold",
                      isCurrentModule ? "text-blue-600" : "text-gray-500"
                    )}>
                      Module {moduleIndex + 1}
                    </span>
                  </div>
                  <h3 className={cn(
                    "font-semibold text-sm mt-1 line-clamp-2",
                    isCurrentModule ? "text-blue-700" : "text-gray-900"
                  )}>
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {completedCount}/{totalLessons} lessons
                    </span>
                    {completedCount === totalLessons && totalLessons > 0 && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="bg-gray-50">
                  {moduleLessons.map((lesson: any, lessonIndex: number) => {
                    const isCurrentLesson = lesson.id === currentLessonId;
                    const isCompleted = completedLessons.has(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(module.id, lessonIndex)}
                        className="w-full px-4 py-2.5 pl-12 flex items-start gap-3 hover:bg-gray-100 transition-colors text-left"
                      >
                        {/* Lesson Status Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : isCurrentLesson ? (
                            <Circle className="w-4 h-4 text-blue-600 fill-blue-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium line-clamp-2",
                            isCurrentLesson ? "text-blue-700" : "text-gray-700"
                          )}>
                            {lesson.title}
                          </p>
                          {lesson.estimated_duration_minutes && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {lesson.estimated_duration_minutes} min
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 shadow-md hover:bg-gray-50 transition-all z-20"
        style={{ left: isOpen ? '320px' : '0px' }}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </>
  );
};

export default CourseSidebar;