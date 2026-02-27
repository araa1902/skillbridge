import { Button } from "@/components/ui/button";
import { Bell, Gear as Settings, SignOut as LogOut } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface PageHeaderProps {
  title?: string;
  description?: string;
  subtitle?: string;
}

export function PageHeader({
  title,
  description,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div>
          {title && <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
        </div>
      </div>
    </div>
  );
}
