import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from '@phosphor-icons/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const VerifiedBadge = ({ verified = true }: { verified?: boolean }) => {
  if (!verified) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 cursor-help flex items-center gap-1 hover:bg-blue-100 transition-colors">
            <CheckCircle weight="fill" className="text-blue-500 w-3 h-3" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Verified SME</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-[250px] p-3 text-sm">
          <p>
            This business has been vetted by the SkillBridge trust and safety team.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
