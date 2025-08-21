import { useState, useRef, useEffect } from "react";

interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

interface DifficultyDistributionProps {
  distribution: DifficultyDistribution;
  onChange: (distribution: DifficultyDistribution) => void;
}

const DifficultyDistribution = ({ distribution, onChange }: DifficultyDistributionProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null);

  // Convert distribution to slider positions (0-100)
  const leftSliderPos = distribution.easy;
  const rightSliderPos = distribution.easy + distribution.medium;

  const handleMouseDown = (slider: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(slider);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));

    if (isDragging === 'left') {
      // Left slider can't go beyond right slider
      const maxPos = rightSliderPos;
      const newLeftPos = Math.min(percentage, maxPos);
      const newEasy = newLeftPos;
      const newMedium = rightSliderPos - newLeftPos;
      const newHard = 100 - rightSliderPos;
      
      onChange({
        easy: Math.round(newEasy),
        medium: Math.round(newMedium),
        hard: Math.round(newHard)
      });
    } else if (isDragging === 'right') {
      // Right slider can't go beyond left slider
      const minPos = leftSliderPos;
      const newRightPos = Math.max(percentage, minPos);
      const newEasy = leftSliderPos;
      const newMedium = newRightPos - leftSliderPos;
      const newHard = 100 - newRightPos;
      
      onChange({
        easy: Math.round(newEasy),
        medium: Math.round(newMedium),
        hard: Math.round(newHard)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, leftSliderPos, rightSliderPos]);

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-6 bg-muted rounded-full overflow-hidden cursor-pointer"
        >
          {/* Easy section */}
          <div
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-200"
            style={{ width: `${distribution.easy}%` }}
          />
          {/* Medium section */}
          <div
            className="absolute top-0 h-full bg-yellow-500 transition-all duration-200"
            style={{ 
              left: `${distribution.easy}%`, 
              width: `${distribution.medium}%` 
            }}
          />
          {/* Hard section */}
          <div
            className="absolute top-0 h-full bg-red-500 transition-all duration-200"
            style={{ 
              left: `${distribution.easy + distribution.medium}%`, 
              width: `${distribution.hard}%` 
            }}
          />
          
          {/* Left slider handle */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-y-1/2 -translate-x-1/2 shadow-md hover:scale-110 transition-transform z-10"
            style={{ left: `${leftSliderPos}%` }}
            onMouseDown={handleMouseDown('left')}
          />
          
          {/* Right slider handle */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-y-1/2 -translate-x-1/2 shadow-md hover:scale-110 transition-transform z-10"
            style={{ left: `${rightSliderPos}%` }}
            onMouseDown={handleMouseDown('right')}
          />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>简单 {distribution.easy}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>中等 {distribution.medium}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>困难 {distribution.hard}%</span>
        </div>
      </div>
    </div>
  );
};

export default DifficultyDistribution;