"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Page = () => {
  return (
    <div className="relative h-screen w-full bg-yellow-100/20">
      {/* Background Image with subtle overlay */}
      <div className="
        absolute inset-0
        bg-[url('/fitflex_mobile_homepage.png')]
        md:bg-[url('/fitflex_tab_homepage.png')]
        lg:bg-[url('/fitflex_homePage.png')]
        bg-cover bg-center bg-no-repeat
      ">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Minimal Content */}
      <div className="relative z-10 h-full flex flex-col justify-between items-center text-white p-8">
        {/* Top Logo Space - empty for breathing room */}

        {/* Main Message */}
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="block bg-blend-darken">UNLEASH</span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              THE BEAST
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
            No excuses. Just results.
          </p>

          <div className="flex gap-4">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-6 text-lg rounded-full" asChild>
              <Link href="/login">START</Link>
            </Button>
            <Button  className="border-white bg-yellow-100/20 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
              EXPLORE
            </Button>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="text-sm text-gray-300 tracking-widest">
          #FITFLEX • TRAIN HARD • STAY STRONG
        </p>
      </div>
    </div>
  )
}

export default Page