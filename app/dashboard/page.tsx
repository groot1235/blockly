"use client"
import { SignOutButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

type Props = {}

const page = (props: Props) => {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    if (!isLoaded) return null;
    const name =
        user?.firstName ||
        user?.username ||
        "there";

    const games = [
        {
            id: "puzzle",
            name: "Puzzle",
            path: "/puzzle",
            description: "Learn to connect blocks and create simple programs",
        },
        {
            id: "maze",
            name: "Maze",
            path: "/maze",
            description: "Navigate through mazes using programming logic",
        },
        {
            id: "bird",
            name: "Bird",
            path: "/bird",
            description: "Guide the bird to its target with code",
        },
        {
            id: "turtle",
            name: "Turtle",
            path: "/turtle",
            description: "Draw shapes and patterns with turtle graphics",
        },
        {
            id: "movie",
            name: "Movie",
            path: "/movie",
            description: "Create animations using programming blocks",
        },
        {
            id: "music",
            name: "Music",
            path: "/music",
            description: "Compose music through code blocks",
        },
        {
            id: "pond",
            name: "Pond",
            path: "/pond",
            description: "Solve real programming challenges",
        },
        {
            id: "js-pond",
            name: "JS Pond",
            path: "/js-pond",
            description: "Practice JavaScript concepts directly",
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentGame = games[currentIndex];
    const prevGame = games[currentIndex - 1];
    const nextGame = games[currentIndex + 1];

    return (
        <div className='px-20 py-10'>
            <div className='flex justify-between'>
                <h1 className="text-3xl md:text-4xl font-semibold">
                    Welcome, {name}
                </h1>
                <Button variant="outline" className='text-red-500 '>
                    <SignOutButton />
                </Button>
            </div>
            <div className="relative flex items-center justify-center gap-10 mt-16 min-h-[420px]">
                <AnimatePresence mode='popLayout' initial={false}>
                    {prevGame && (
                        <motion.div
                            key={prevGame.id}
                            layoutId={prevGame.id}
                            initial={{ opacity: 0, x: -50, scale: 0.8 }}
                            animate={{ opacity: 0.6, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.8 }}
                            transition={{ duration: 0.4, type: "spring" }}
                            className="w-64 h-80 rounded-xl bg-[#1c1c1c] border border-white/10
                      flex items-center justify-center text-center p-4 cursor-pointer"
                            onClick={() => setCurrentIndex(currentIndex - 1)}
                        >
                            {prevGame.name}
                        </motion.div>
                    )}
                    <motion.div
                        onClick={() => router.push(currentGame.path)}
                        key={currentGame.id}
                        layoutId={currentGame.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="w-80 h-[420px] rounded-xl bg-[#1c1c1c] border border-white/20
                    flex flex-col items-center justify-center text-center z-10"
                    >
                        <motion.h2 layoutId={`${currentGame.id}-title`} className="text-2xl font-semibold">{currentGame.name}</motion.h2>
                        <motion.p layoutId={`${currentGame.id}-desc`} className="text-muted-foreground mt-4 px-6">
                            {currentGame.description}
                        </motion.p>
                    </motion.div>
                    {nextGame && (
                        <motion.div
                            key={nextGame.id}
                            layoutId={nextGame.id}
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 0.6, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.8 }}
                            transition={{ duration: 0.4, type: "spring" }}
                            className="w-64 h-80 rounded-xl bg-[#1c1c1c] border border-white/10
                      flex items-center justify-center text-center p-4 cursor-pointer"
                            onClick={() => setCurrentIndex(currentIndex + 1)}
                        >
                            {nextGame.name}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex justify-center gap-6 mt-10">
                <Button
                    variant="outline"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(i => i - 1)}
                >
                    Previous
                </Button>

                <Button
                    disabled={currentIndex === games.length - 1}
                    onClick={() => setCurrentIndex(i => i + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default page