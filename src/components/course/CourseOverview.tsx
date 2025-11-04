import React from 'react';
import { Clock, Users, Award, BookOpen, Target, CheckCircle } from 'lucide-react';

interface CourseOverviewProps {
  course: {
    title: string;
    description: string;
    short_description: string;
    difficulty_level: string;
    estimated_duration_hours: number;
    prerequisites: string[];
    learning_objectives: string[];
    tags: string[];
    tutor_name: string;
    tutor_avatar: string;
    tutor_bio: string;
    color: string;
    modules?: any[];
  };
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'intermediate': return 'bg-primary/20 text-primary border-primary/30';
      case 'advanced': return 'bg-accent/20 text-accent border-accent/30';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
  const totalExercises = course.modules?.reduce((acc, module) => 
    acc + module.lessons?.reduce((lessonAcc: number, lesson: any) => 
      lessonAcc + (lesson.exercises?.length || 0), 0), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(course.difficulty_level)}`}>
                    {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)}
                  </span>
                  <div className="flex items-center gap-1 text-orange-200">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Certificate Included</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {course.title}
                </h1>
                
                <p className="text-xl text-orange-100 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-200" />
                  <div className="text-2xl font-bold">{course.estimated_duration_hours}h</div>
                  <div className="text-sm text-orange-200">Duration</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-orange-200" />
                  <div className="text-2xl font-bold">{course.modules?.length || 0}</div>
                  <div className="text-sm text-orange-200">Modules</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-orange-200" />
                  <div className="text-2xl font-bold">{totalLessons}</div>
                  <div className="text-sm text-orange-200">Lessons</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-orange-200" />
                  <div className="text-2xl font-bold">{totalExercises}</div>
                  <div className="text-sm text-orange-200">Exercises</div>
                </div>
              </div>
            </div>

            {/* Tutor Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-sm">
              <div className="text-center space-y-4">
                <img 
                  src={course.tutor_avatar} 
                  alt={course.tutor_name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-white/20"
                />
                <div>
                  <h3 className="text-xl font-semibold">{course.tutor_name}</h3>
                  <p className="text-orange-200 text-sm mt-2 leading-relaxed">
                    {course.tutor_bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives & Prerequisites */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            What You'll Learn
          </h2>
          <ul className="space-y-3">
            {course.learning_objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-secondary" />
            Prerequisites
          </h2>
          {course.prerequisites.length > 0 ? (
            <ul className="space-y-3">
              {course.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{prereq}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No prerequisites required - perfect for beginners!</p>
          )}
          
          {/* Tags */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Course Tags</h3>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
