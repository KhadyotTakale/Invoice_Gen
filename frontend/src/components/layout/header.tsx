
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
              EstimateAce
            </h1>
          </Link>
        </div>

        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/estimates">Estimates</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/clients">Clients</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/estimates/new" className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Estimate
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link to="/estimates" className="transition-colors hover:text-primary">
                Estimates
              </Link>
              <Link to="/clients" className="transition-colors hover:text-primary">
                Clients
              </Link>
              <Link to="/settings" className="transition-colors hover:text-primary">
                Settings
              </Link>
            </nav>
            <Button asChild>
              <Link to="/estimates/new" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Create Estimate</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
