import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Code2,
  Palette,
  Layout,
  FormInput,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Exercise templates
interface Exercise {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  icon: any;
  initialHTML: string;
  initialCSS: string;
  hint: string;
  solution: {
    html: string;
    css: string;
  };
  objective: string;
}

const exercises: Exercise[] = [
  {
    id: 'button-hover',
    title: 'Button Hover Effects',
    category: 'Buttons',
    difficulty: 'beginner',
    description: 'Create an interactive button with smooth hover effects',
    icon: Sparkles,
    initialHTML: `<button class="custom-btn">
  Hover Me
</button>`,
    initialCSS: `.custom-btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #3b82f6;
  color: white;
  /* Add your hover effects here */
}`,
    hint: 'Try using transform: scale() and transition properties to create a smooth hover effect',
    solution: {
      html: `<button class="custom-btn">
  Hover Me
</button>`,
      css: `.custom-btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #3b82f6;
  color: white;
  transition: all 0.3s ease;
}

.custom-btn:hover {
  background: #2563eb;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}`
    },
    objective: 'Add smooth hover effects with scale transformation and shadow'
  },
  {
    id: 'flexbox-center',
    title: 'Flexbox Centering',
    category: 'Layout',
    difficulty: 'beginner',
    description: 'Center content both horizontally and vertically using Flexbox',
    icon: Layout,
    initialHTML: `<div class="container">
  <div class="box">
    Centered Content
  </div>
</div>`,
    initialCSS: `.container {
  width: 100%;
  height: 400px;
  background: #f3f4f6;
  /* Add flexbox properties here */
}

.box {
  padding: 20px 40px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
}`,
    hint: 'Use display: flex with justify-content and align-items properties',
    solution: {
      html: `<div class="container">
  <div class="box">
    Centered Content
  </div>
</div>`,
      css: `.container {
  width: 100%;
  height: 400px;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  padding: 20px 40px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
}`
    },
    objective: 'Center the box both horizontally and vertically in the container'
  },
  {
    id: 'grid-layout',
    title: 'CSS Grid Gallery',
    category: 'Layout',
    difficulty: 'intermediate',
    description: 'Create a responsive image gallery using CSS Grid',
    icon: Layout,
    initialHTML: `<div class="gallery">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>`,
    initialCSS: `.gallery {
  width: 100%;
  padding: 20px;
  background: #f9fafb;
  /* Add grid properties here */
}

.item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}`,
    hint: 'Use display: grid with grid-template-columns and gap properties',
    solution: {
      html: `<div class="gallery">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>`,
      css: `.gallery {
  width: 100%;
  padding: 20px;
  background: #f9fafb;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}`
    },
    objective: 'Create a responsive grid layout with automatic column sizing'
  },
  {
    id: 'form-styling',
    title: 'Modern Form Design',
    category: 'Forms',
    difficulty: 'intermediate',
    description: 'Style a modern, accessible form with focus states',
    icon: FormInput,
    initialHTML: `<form class="modern-form">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" placeholder="Enter your email">
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" placeholder="Enter password">
  </div>
  <button type="submit">Sign In</button>
</form>`,
    initialCSS: `.modern-form {
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  /* Add focus styles here */
}

button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  /* Add hover and active states */
}`,
    hint: 'Add focus states with outline and box-shadow, and hover effects for the button',
    solution: {
      html: `<form class="modern-form">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" placeholder="Enter your email">
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" placeholder="Enter password">
  </div>
  <button type="submit">Sign In</button>
</form>`,
      css: `.modern-form {
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #2563eb;
}

button:active {
  transform: scale(0.98);
}`
    },
    objective: 'Add focus states to inputs and hover/active states to the button'
  },
  {
    id: 'card-design',
    title: 'Product Card',
    category: 'Cards',
    difficulty: 'intermediate',
    description: 'Design an attractive product card with hover effects',
    icon: CreditCard,
    initialHTML: `<div class="product-card">
  <div class="card-image">
    <div class="placeholder">Image</div>
  </div>
  <div class="card-content">
    <h3>Product Name</h3>
    <p class="description">A brief description of the product</p>
    <div class="card-footer">
      <span class="price">$99.99</span>
      <button class="buy-btn">Buy Now</button>
    </div>
  </div>
</div>`,
    initialCSS: `.product-card {
  width: 300px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* Add hover effects here */
}

.card-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.card-content {
  padding: 20px;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #111827;
}

.description {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
}

.buy-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}`,
    hint: 'Add a hover effect that lifts the card and enhances the shadow',
    solution: {
      html: `<div class="product-card">
  <div class="card-image">
    <div class="placeholder">Image</div>
  </div>
  <div class="card-content">
    <h3>Product Name</h3>
    <p class="description">A brief description of the product</p>
    <div class="card-footer">
      <span class="price">$99.99</span>
      <button class="buy-btn">Buy Now</button>
    </div>
  </div>
</div>`,
      css: `.product-card {
  width: 300px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.card-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.card-content {
  padding: 20px;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #111827;
}

.description {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
}

.buy-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.buy-btn:hover {
  background: #2563eb;
}`
    },
    objective: 'Add a hover effect that lifts the card with enhanced shadow'
  }
];

const Practice = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises[0]);
  const [html, setHtml] = useState(exercises[0].initialHTML);
  const [css, setCSS] = useState(exercises[0].initialCSS);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const { toast } = useToast();

  // Update code when exercise changes
  useEffect(() => {
    setHtml(selectedExercise.initialHTML);
    setCSS(selectedExercise.initialCSS);
    setShowHint(false);
    setShowSolution(false);
    setActiveTab('html');
  }, [selectedExercise]);

  // Generate preview HTML
  const getPreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #ffffff;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  };

  const handleReset = () => {
    setHtml(selectedExercise.initialHTML);
    setCSS(selectedExercise.initialCSS);
    setShowHint(false);
    setShowSolution(false);
    toast({
      title: "Reset Complete",
      description: "Code has been reset to the starting template",
    });
  };

  const handleShowSolution = () => {
    setHtml(selectedExercise.solution.html);
    setCSS(selectedExercise.solution.css);
    setShowSolution(true);
    toast({
      title: "Solution Loaded",
      description: "Review the solution and try to understand the approach",
    });
  };

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1800px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">UI Design Practice Lab</h1>
          <p className="text-gray-600">
            Practice your HTML and CSS skills with interactive exercises. Write code and see results in real-time!
          </p>
        </div>

        {/* Exercise Selector */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <selectedExercise.icon className="h-5 w-5" />
                  {selectedExercise.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedExercise.description}
                </CardDescription>
              </div>
              <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                {selectedExercise.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Exercise:</label>
                <Select
                  value={selectedExercise.id}
                  onValueChange={(value) => {
                    const exercise = exercises.find(e => e.id === value);
                    if (exercise) setSelectedExercise(exercise);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        <div className="flex items-center gap-2">
                          <exercise.icon className="h-4 w-4" />
                          {exercise.title} - {exercise.category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Objective:</p>
                  <p className="text-blue-800 text-sm">{selectedExercise.objective}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Practice Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Panel */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Code Editor
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {showHint ? 'Hide' : 'Show'} Hint
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleShowSolution}
                  >
                    View Solution
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-yellow-900 text-sm">Hint:</p>
                        <p className="text-yellow-800 text-sm">{selectedExercise.hint}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'html' | 'css')} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="flex-1 mt-0">
                  <ScrollArea className="h-[500px] w-full rounded-md border">
                    <textarea
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-gray-50 focus:outline-none resize-none"
                      spellCheck={false}
                      placeholder="Write your HTML here..."
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="css" className="flex-1 mt-0">
                  <ScrollArea className="h-[500px] w-full rounded-md border">
                    <textarea
                      value={css}
                      onChange={(e) => setCSS(e.target.value)}
                      className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-gray-50 focus:outline-none resize-none"
                      spellCheck={false}
                      placeholder="Write your CSS here..."
                    />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Live Preview Panel */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 bg-gray-100 rounded-lg p-4 overflow-auto">
                <div
                  className="mx-auto bg-white rounded-lg shadow-sm transition-all duration-300"
                  style={{ width: getViewportWidth(), minHeight: '500px' }}
                >
                  <iframe
                    srcDoc={getPreviewHTML()}
                    title="preview"
                    sandbox="allow-scripts"
                    className="w-full h-full min-h-[500px] border-0 rounded-lg"
                  />
                </div>
              </div>

              {showSolution && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-green-800 text-sm font-medium">
                      Solution loaded! Study the code and try to recreate it yourself.
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exercise Categories Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Exercise Categories</CardTitle>
            <CardDescription>
              Explore different UI design challenges to improve your skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Buttons', icon: Sparkles, count: exercises.filter(e => e.category === 'Buttons').length },
                { name: 'Layout', icon: Layout, count: exercises.filter(e => e.category === 'Layout').length },
                { name: 'Forms', icon: FormInput, count: exercises.filter(e => e.category === 'Forms').length },
                { name: 'Cards', icon: CreditCard, count: exercises.filter(e => e.category === 'Cards').length },
              ].map((category) => (
                <div
                  key={category.name}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                  onClick={() => {
                    const firstExercise = exercises.find(e => e.category === category.name);
                    if (firstExercise) setSelectedExercise(firstExercise);
                  }}
                >
                  <category.icon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.count} exercises</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Practice;
