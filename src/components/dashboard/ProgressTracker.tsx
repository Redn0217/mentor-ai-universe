
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SkillProgress {
  name: string;
  progress: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  lastPracticed: string;
}

interface ProgressTrackerProps {
  skills: SkillProgress[];
}

export function ProgressTracker({ skills }: ProgressTrackerProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'advanced':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Track your skill development across technologies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.length === 0 ? (
            <p className="text-muted-foreground">No skills tracked yet. Practice in the Playground to track your progress.</p>
          ) : (
            skills.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{skill.name}</div>
                  <Badge className={getLevelColor(skill.level)}>
                    {skill.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={skill.progress} className="h-2 flex-1" />
                  <div className="text-sm text-muted-foreground w-10 text-right">
                    {skill.progress}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last practiced: {skill.lastPracticed}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
