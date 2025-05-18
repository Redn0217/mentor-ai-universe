
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here...');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const { user } = useAuth();
  
  // Mock execution function - in a real app, this would connect to a backend service
  const executeCode = () => {
    try {
      // This is just a simple mock implementation
      if (language === 'javascript') {
        // In a real implementation, we would use a secure evaluation method or backend
        // For demo purposes, we'll just show a mock output
        setOutput(`Executing ${language} code...\n\nOutput:\n> Hello, world!`);
      } else {
        setOutput(`Execution for ${language} is not implemented in this demo.`);
      }
      
      // In a real app, we would also track this activity
      if (user) {
        console.log(`User ${user.email} executed ${language} code`);
        // Track progress, save to database, etc.
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[70vh]">
      {/* Code Editor Panel */}
      <Card className="flex flex-col h-full">
        <CardContent className="flex flex-col h-full p-0">
          <Tabs defaultValue="editor" className="flex flex-col h-full">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                  <select 
                    className="text-sm bg-white dark:bg-gray-700 border rounded px-2 py-1"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                  </select>
                  <Button onClick={executeCode} size="sm">
                    Run
                  </Button>
                </div>
              </div>
            </div>
            
            <TabsContent value="editor" className="flex-grow p-0">
              <textarea
                className="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-900 resize-none focus:outline-none"
                value={code}
                onChange={handleCodeChange}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Editor Settings</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="line-numbers" className="mr-2" />
                      <label htmlFor="line-numbers">Show line numbers</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="auto-complete" className="mr-2" />
                      <label htmlFor="auto-complete">Enable autocomplete</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="syntax-highlight" className="mr-2" defaultChecked />
                      <label htmlFor="syntax-highlight">Syntax highlighting</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Theme</h3>
                  <select className="mt-2 w-full p-2 border rounded">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Monokai</option>
                    <option>Dracula</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Font Size</h3>
                  <select className="mt-2 w-full p-2 border rounded">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Output Panel */}
      <Card className="flex flex-col h-full">
        <CardContent className="flex flex-col h-full p-0">
          <Tabs defaultValue="output" className="flex flex-col h-full">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b">
              <TabsList>
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="output" className="flex-grow p-0">
              <pre className="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-900 overflow-auto">
                {output || 'Run your code to see output here...'}
              </pre>
            </TabsContent>
            
            <TabsContent value="feedback" className="p-4 overflow-auto h-full">
              {output ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Code Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Your code looks good! Here are some suggestions for improvement:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                      <li>Consider adding comments to explain your logic</li>
                      <li>You could optimize the loop by using a different approach</li>
                      <li>Variable names could be more descriptive</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Performance</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      This solution has O(n) time complexity. There's potential to improve to O(log n).
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Learning Resources</h3>
                    <div className="mt-2 text-sm space-y-2">
                      <div className="border p-3 rounded">
                        <h4 className="font-medium">Advanced Loop Techniques</h4>
                        <p className="text-gray-600 dark:text-gray-400">Learn more about efficient looping in JavaScript.</p>
                      </div>
                      <div className="border p-3 rounded">
                        <h4 className="font-medium">Clean Code Principles</h4>
                        <p className="text-gray-600 dark:text-gray-400">Best practices for writing maintainable code.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  Run your code to receive AI feedback
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
