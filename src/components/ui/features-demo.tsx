import { Features } from "@/components/ui/features";
import { Brain, BrainCog, BookOpen, Code, Users, Zap } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Users,
    title: "Specialized AI Tutors",
    description:
      "Meet your personal AI mentors - domain experts trained specifically for different tech fields. Each tutor has unique personality and specialized knowledge to guide your learning journey.",
    image: "https://bcalabs.org/companions.jpg",
  },
  {
    id: 2,
    icon: Brain,
    title: "Adaptive Learning Paths",
    description:
      "Our AI analyzes your learning patterns, strengths, and knowledge gaps to dynamically adjust your curriculum and suggest the most effective next steps.",
    image: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=600&h=400&fit=crop&crop=center",
  },
  {
    id: 3,
    icon: Zap,
    title: "Instant Code Review & Debugging",
    description:
      "Get real-time feedback on your code with AI-powered analysis that identifies bugs, suggests optimizations, and explains best practices as you write.",
    image: "https://plus.unsplash.com/premium_vector-1734451912155-52c70efc6275?w=600&h=400&fit=crop&crop=center",
  },
  {
    id: 4,
    icon: BrainCog,
    title: "Voice-Interactive Learning",
    description:
      "Practice technical interviews, explain concepts aloud, and engage in natural conversations with AI tutors using advanced voice recognition and synthesis.",
    image: "https://images.unsplash.com/photo-1724185773486-0b39642e607e?w=600&h=400&fit=crop&crop=center",
  },
];

const FeaturesDemo = () => {
  return (
    <Features
      primaryColor="brand-teal"
      progressGradientLight="bg-gradient-to-r from-brand-teal to-brand-orange"
      progressGradientDark="bg-gradient-to-r from-brand-teal to-brand-orange"
      features={features}
    />
  );
};

export { FeaturesDemo };
