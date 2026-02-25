"use client";
import Faq from "./sections/faq";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "./sections/Footer";


export default function Home() {
  const games = [
    { name: "Maze", icon: "/figma-logo.svg" },
    { name: "Bird", icon: "/framer-logo.svg" },
    { name: "Turtle", icon: "/github-logo.svg" },
    { name: "Movie", icon: "/notion-logo.svg" },
    { name: "Music", icon: "/relume-logo.svg" },
    { name: "Pond", icon: "/slack-logo.svg" },
  ];
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
      <div className="">
        <div className="bg-[#171717] flex p-4 text-semibold mx-20 my-7 rounded-2xl items-center justify-center text-center ">
          <div className="font-mono text-xl cursor-pointer">
            <Link href="/">Blockly</Link>
          </div>
          <div className="flex ml-auto space-x-20">
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

          <div className="flex ml-auto">
            <Button className="mr-2">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 max-w-md mx-auto">

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
        </div>

      </div>
      <div id="faq">
        <Faq />
      </div>
      <Footer />
    </div >
  );
}
