
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/header";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} EstimateAce Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
