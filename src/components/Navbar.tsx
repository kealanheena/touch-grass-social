import React from 'react'
import Link from "next/link";
import { Flower2Icon } from "lucide-react";

import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

async function Navbar() {
  const user = await currentUser()

  if (user) {
    syncUser()
  }
  
  return (
    <nav className="sticky top-0 w-full border-b border-b-(--color-chart-2) bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
    	<div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold font-mono tracking-wider">
              <Flower2Icon className="inline mx-3 text-(--color-chart-2)" />
              Touch Grass Social
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  )
}

export default Navbar