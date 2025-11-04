import React from 'react';
import { Clock, BookOpen, Target, PlayCircle, CheckCircle2, Lock } from 'lucide-react';

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    estimated_duration_minutes: number;
    difficulty_level: string;
    learning_objectives: string[];
    key_concepts: string[];
    lessons: any[];
    order_index: number;
  };
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
  onStartModule: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  isUnlocked, 
  isCompleted, 
  progress, 
  onStartModule 
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'intermediate': return 'bg-primary/20 text-primary border-primary/30';
      case 'advanced': return 'bg-accent/20 text-accent border-accent/30';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isUnlocked ? 'border-gray-200 hover:border-primary/30' : 'border-gray-100 opacity-75'
    }`}>
      {/* Progress Bar */}
      {isUnlocked && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
              isCompleted ? 'bg-secondary/20 text-secondary' :
              isUnlocked ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-400'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : isUnlocked ? (
                module.order_index
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {module.title}
              </h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(module.difficulty_level)}`}>
                {module.difficulty_level.charAt(0).toUpperCase() + module.difficulty_level.slice(1)}
              </span>
            </div>
          </div>

          {isUnlocked && (
            <button
              onClick={onStartModule}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isCompleted
                  ? 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Review
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  {progress > 0 ? 'Continue' : 'Start'}
                </>
              )}
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          {module.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(module.estimated_duration_minutes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{module.lessons?.length || 0} lessons</span>
          </div>
          {progress > 0 && (
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{Math.round(progress)}% complete</span>
            </div>
          )}
        </div>

        {/* Learning Objectives */}
        {isUnlocked && module.learning_objectives && module.learning_objectives.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Learning Objectives:</h4>
            <ul className="space-y-1">
              {module.learning_objectives.slice(0, 3).map((objective, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>{objective}</span>
                </li>
              ))}
              {module.learning_objectives.length > 3 && (
                <li className="text-sm text-gray-400 ml-3.5">
                  +{module.learning_objectives.length - 3} more objectives
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Key Concepts */}
        {isUnlocked && module.key_concepts && module.key_concepts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Concepts:</h4>
            <div className="flex flex-wrap gap-1">
              {module.key_concepts.slice(0, 6).map((concept, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                >
                  {concept}
                </span>
              ))}
              {module.key_concepts.length > 6 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
                  +{module.key_concepts.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Lessons Preview */}
        {isUnlocked && module.lessons && module.lessons.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Lessons in this module:</h4>
            <div className="space-y-2">
              {module.lessons.slice(0, 3).map((lesson, index) => (
                <div key={lesson.id} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 flex-1">{lesson.title}</span>
                  <span className="text-gray-400">{lesson.estimated_duration_minutes}m</span>
                </div>
              ))}
              {module.lessons.length > 3 && (
                <div className="text-sm text-gray-400 ml-9">
                  +{module.lessons.length - 3} more lessons
                </div>
              )}
            </div>
          </div>
        )}

        {/* Locked State */}
        {!isUnlocked && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Complete previous modules to unlock</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
