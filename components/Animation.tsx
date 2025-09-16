// components/Animation.tsx
import Splash from "./Splash";

export default function Animation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <Splash mode="loading" />
    </div>
  );
}