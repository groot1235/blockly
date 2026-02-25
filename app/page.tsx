"use client";
import { useState } from "react";
import Faq from "./sections/faq";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "./sections/Footer";


export default function Home() {
  const games = [
    { name: "Puzzle", icon: "/figma-logo.svg", description: "Learn how to use Blockly's shapes and connect blocks" },
    { name: "Maze", icon: "/framer-logo.svg", description: "Navigate through mazes using programming logic" },
    { name: "Bird", icon: "/github-logo.svg", description: "Use math and logic to guide a bird to a worm" },
    { name: "Turtle", icon: "/notion-logo.svg", description: "Draw shapes by giving instructions to a turtle" },
    { name: "Movie", icon: "/relume-logo.svg", description: "Animate a movie using mathematical equations" },
    { name: "Music", icon: "/slack-logo.svg", description: "Compose music by connecting notes and durations" },
    { name: "Pond", icon: "/figma-logo.svg", description: "Program smart ducks to compete against others" },
  ];
  const [currentGame, setCurrentGame] = useState(0);

  const nextGame = () => setCurrentGame((prev) => (prev + 1) % games.length);
  const prevGame = () => setCurrentGame((prev) => (prev - 1 + games.length) % games.length);
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -80; // adjust if you add a sticky navbar later
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="px-4 md:px-0 z-50 relative">
        <div className="bg-[#171717]/90 backdrop-blur-md flex px-4 md:px-8 py-4 font-semibold md:mx-20 my-4 md:my-7 rounded-2xl items-center justify-between border border-white/5 shadow-2xl">
          <div className="font-mono text-xl cursor-pointer z-10 shrink-0">
            <Link href="/">Blockly</Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-12">
            <button
              onClick={() => scrollToSection("dashboard")}
              className="hover:text-indigo-400 transition"
            >
              About
            </button>

            <button
              onClick={() => scrollToSection("games")}
              className="hover:text-indigo-400 transition"
            >
              Games
            </button>

            <button
              onClick={() => scrollToSection("faq")}
              className="hover:text-indigo-400 transition"
            >
              FAQ
            </button>
          </div>

          <div className="flex z-10 gap-2 md:gap-3 items-center">
            <Button size="sm" className="md:h-10 md:px-6" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex md:h-10 md:px-6" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
      <div >
        <div className="flex flex-col items-center justify-center text-center px-6 py-24 my-30">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            A Modern Way to Learn Coding with Blocks
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-foreground">
            Build logical thinking and programming fundamentals through interactive,
            game-based block coding — redesigned with a modern learning experience.
          </p>
        </div>
        <div className="flex items-center justify-center relative -mt-24" id="dashboard">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full">
          </div>
          <Image
            src="/dasboard.png"
            alt="dashboard"
            width={1000}
            height={1000}
            className="rounded-2xl z-10"
          />

        </div>
      </div>
      <div className="mx-6 md:mx-20 pt-40 pb-10" id="games">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center ">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Learn Core Programming Concepts Through Games
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl">
              Each Blockly game is designed to introduce a specific programming concept through hands-on interaction.
              By solving puzzles, drawing shapes, or guiding characters, learners build strong logical foundations
              without worrying about syntax.

            </p>
          </div>
          {/* Desktop Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="hidden md:grid grid-cols-2 gap-3 max-w-md mx-auto">

            {games.map((game) => (
              <motion.div
                key={game.name}
                className="flex items-center justify-center h-32 rounded-2xl
                 bg-[#1c1c1c] border border-white/10
                 hover:border-indigo-400/40 transition"
              >
                <Image
                  src={game.icon}
                  alt={game.name}
                  width={100}
                  height={100}
                  className="m-3 opacity-90"
                />

              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Carousel */}
          <div className="flex md:hidden flex-col items-center justify-center w-full mt-10">
            <div className="flex flex-row items-center justify-center w-full h-[320px] px-2">

              {/* Current Game ONLY */}
              <div className="w-[80%] max-w-sm h-80 bg-[#1c1c1c] rounded-3xl border border-white/10 flex flex-col items-center justify-center p-4 sm:p-6 shadow-2xl relative z-10 transition-all">
                <Image
                  src={games[currentGame].icon}
                  alt={games[currentGame].name}
                  width={60}
                  height={60}
                  className="mb-8 opacity-90 drop-shadow-lg"
                />
                <h3 className="text-2xl font-bold mb-3 text-white">{games[currentGame].name}</h3>
                <p className="text-center text-white/50 text-sm leading-relaxed">{games[currentGame].description}</p>
              </div>

            </div>

            <div className="flex gap-4 mt-12 mb-4">
              <Button variant="outline" onClick={prevGame} className="bg-transparent border-white/10 text-white/80 hover:bg-white/5 hover:text-white px-6">Previous</Button>
              <Button onClick={nextGame} className="bg-white text-black hover:bg-gray-200 px-8">Next</Button>
            </div>
          </div>
        </div>

      </div>
      <div id="faq">
        <Faq />
      </div>
      <Footer />
    </div>
  );
}
