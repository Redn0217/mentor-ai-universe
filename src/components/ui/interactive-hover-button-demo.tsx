import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

function InteractiveHoverButtonDemo() {
  return (
    <div className="flex gap-8 p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
      <InteractiveHoverButton text="Get a demo" />
      <InteractiveHoverButton text="Log in" />
      <InteractiveHoverButton text="Explore Technologies" className="w-auto px-6" />
    </div>
  );
}

export { InteractiveHoverButtonDemo };
