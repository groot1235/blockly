"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Check, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "@/lib/blocks/mazeBlocks";

// 6x6 Grid Maze
// 0: Wall, 1: Path, 2: Start, 3: Goal
const MAZE = [
    [0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 3],
    [0, 0, 0, 0, 0, 0]
];
const START_POS = { r: 1, c: 1 };
const START_DIR = 0; // 0: Right, 1: Down, 2: Left, 3: Up
const GOAL_POS = { r: 4, c: 5 };

const MazePage = () => {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    // Game state
    const [charPos, setCharPos] = useState({ r: START_POS.r, c: START_POS.c });
    const [charDir, setCharDir] = useState(START_DIR);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);

    // Safety token for loops
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!blocklyDiv.current) return;

        const workspace = Blockly.inject(blocklyDiv.current, {
            toolbox: `
     <xml>  
       <block type="maze_moveForward"></block>
       <block type="maze_turn">
         <field name="DIR">turnLeft</field>
       </block>
       <block type="maze_turn">
         <field name="DIR">turnRight</field>
       </block>
       <block type="maze_if"></block>
       <block type="maze_ifElse"></block>
       <block type="maze_forever"></block>
     </xml>`,
            theme: Blockly.Themes.Dark,
            move: {
                scrollbars: true,
                drag: true,
                wheel: true
            }
        });

        workspaceRef.current = workspace;

        return () => {
            workspace.dispose();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const playProgram = async () => {
        if (!workspaceRef.current) return;
        if (isRunning) return;
        setIsRunning(true);
        setIsDone(false);

        // Reset positions
        let cR = START_POS.r;
        let cC = START_POS.c;
        let cDir = START_DIR;
        setCharPos({ r: cR, c: cC });
        setCharDir(cDir);

        const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

        const ac = new AbortController();
        abortControllerRef.current = ac;

        // Yield function to pause execution and see UI updates
        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

        // Evaluate whether a target forward cell is a path or goal
        const checkPath = (r: number, c: number, d: number) => {
            let nextR = r;
            let nextC = c;
            if (d === 0) nextC++;
            else if (d === 1) nextR++;
            else if (d === 2) nextC--;
            else if (d === 3) nextR--;

            if (nextR < 0 || nextR >= 6 || nextC < 0 || nextC >= 6) return false;
            return MAZE[nextR][nextC] !== 0;
        };

        // Async wrappers mapped directly to block outputs
        let loopCounter = 0;
        const api = {
            moveForward: async () => {
                if (ac.signal.aborted) return;
                if (checkPath(cR, cC, cDir)) {
                    if (cDir === 0) cC++;
                    else if (cDir === 1) cR++;
                    else if (cDir === 2) cC--;
                    else if (cDir === 3) cR--;
                    setCharPos({ r: cR, c: cC });
                } else {
                    // Hit a wall
                    ac.abort();
                    alert("Ouch! You hit a wall.");
                }
                await sleep(400);
            },
            turnLeft: async () => {
                if (ac.signal.aborted) return;
                cDir = (cDir + 3) % 4;
                setCharDir(cDir);
                await sleep(300);
            },
            turnRight: async () => {
                if (ac.signal.aborted) return;
                cDir = (cDir + 1) % 4;
                setCharDir(cDir);
                await sleep(300);
            },
            isPathForward: async () => {
                return checkPath(cR, cC, cDir);
            },
            isPathLeft: async () => {
                return checkPath(cR, cC, (cDir + 3) % 4);
            },
            isPathRight: async () => {
                return checkPath(cR, cC, (cDir + 1) % 4);
            },
            isDone: async () => {
                return cR === GOAL_POS.r && cC === GOAL_POS.c;
            },
            yieldStep: async () => {
                // Anti-infinite loop protection
                loopCounter++;
                if (loopCounter > 1000) {
                    ac.abort();
                    console.warn("Infinite loop prevented");
                }
                await sleep(0);
            }
        };

        try {
            // Build async function
            const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
            const executor = new AsyncFunction(
                'moveForward', 'turnLeft', 'turnRight',
                'isPathForward', 'isPathLeft', 'isPathRight',
                'isDone', 'yieldStep',
                `return (async () => { ${code} })();`
            );

            // Execute the code safely
            await executor(
                api.moveForward, api.turnLeft, api.turnRight,
                api.isPathForward, api.isPathLeft, api.isPathRight,
                api.isDone, api.yieldStep
            );

        } catch (e) {
            console.error("Execution error:", e);
        }

        // Final completion check
        if (!ac.signal.aborted && cR === GOAL_POS.r && cC === GOAL_POS.c) {
            setIsDone(true);
        }

        setIsRunning(false);
    };

    const resetProgram = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsRunning(false);
        setCharPos({ r: START_POS.r, c: START_POS.c });
        setCharDir(START_DIR);
        setIsDone(false);
    };

    return (
        <div className="h-screen flex flex-col bg-[#0f0f0f] text-white overflow-hidden">
            {/* Custom Blockly CSS overrides for layout mirroring Bird game */}
            <style dangerouslySetInnerHTML={{
                __html: `
    .blocklyFlyout {
    transform: translate(16px, 400px)!important;
}
                .blocklyFlyoutBackground {
                    fill: #1c1c1c !important;
                    fill-opacity: 1 !important;
                }
                .blocklyFlyoutScrollbar {
                    transform: translate(0px, 400px) !important;
                }
                .blocklySvg {
                    background-color: transparent !important;
                }
                .injectionDiv {
                    background-color: #0f0f0f !important;
                }
            `}} />

            <div className="p-4 border-b border-white/10 flex px-8 items-center bg-[#141414] z-20 shadow-md">
                <div className="flex items-center gap-1 px-1 py-1 bg-white/5 border border-white/10 rounded-xl">
                    <Link
                        href="/dashboard"
                        className="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition"
                    >
                        <ChevronLeft className="w-4 h-4 text-white/70" />
                    </Link>
                    <div className="w-px h-4 bg-white/10" />
                    <button className="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition">
                        <Check className="w-4 h-4 text-white/80" />
                    </button>
                </div>
                <h1 className="text-xl font-semibold pl-10 tracking-wide text-white/90">Maze</h1>
                <p className="text-white/50 text-sm ml-6">
                    Help the character navigate through the maze to reach the goal
                </p>
                <div className="flex-1" />
                <div className="flex gap-4">
                    <button
                        onClick={playProgram}
                        disabled={isRunning}
                        className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-2">
                        <Play className="w-4 h-4" /> Run Program
                    </button>
                    <button
                        onClick={resetProgram}
                        className="bg-transparent border border-white/10 hover:bg-white/5 text-white/70 rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 relative w-full h-full">
                {/* Game Canvas Overlay in Top-Left */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#111111] border-r border-b border-white/10 z-20 flex flex-col items-center justify-center p-6 shadow-lg pointer-events-none">
                    <div className="relative w-full h-full bg-[#1c1c1c] rounded-lg border border-white/10 shadow-inner overflow-hidden pointer-events-auto">

                        {/* Render 6x6 Maze Grid */}
                        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                            {MAZE.map((row, rIdx) =>
                                row.map((cell, cIdx) => (
                                    <div
                                        key={`${rIdx}-${cIdx}`}
                                        className={`border border-white/5 ${cell !== 0 ? 'bg-white/10' : 'bg-transparent'}`}
                                    >
                                        {/* Goal Icon */}
                                        {cell === 3 && !isDone && (
                                            <div className="w-full h-full flex items-center justify-center text-green-400 font-bold text-xl animate-pulse">
                                                ★
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Player Character */}
                        {/* We use grid coordinate math (r,c) * 16.66% to calculate position in 6x6 grid */}
                        <div
                            className="absolute w-[16.66%] h-[16.66%] flex items-center justify-center transition-all duration-300 ease-in-out z-20"
                            style={{
                                left: `${charPos.c * 16.66}%`,
                                top: `${charPos.r * 16.66}%`
                            }}
                        >
                            <div
                                className="w-6 h-6 bg-yellow-400 rounded-sm shadow-[0_0_15px_rgba(250,204,21,0.6)] flex items-center justify-center transition-transform duration-300"
                                style={{
                                    transform: `rotate(${charDir * 90}deg)`
                                }}
                            >
                                {/* Simple direction indicator */}
                                <div className="w-1.5 h-1.5 bg-black rounded-full absolute right-1"></div>
                            </div>
                        </div>

                        {/* Congrats Overlay */}
                        {isDone && (
                            <div className="absolute inset-0 bg-black/70 z-30 flex flex-col items-center justify-center gap-2 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
                                <span className="text-4xl drop-shadow-md mb-2">🏆</span>
                                <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">Goal Reached!</h2>
                                <p className="text-sm text-white/80 font-medium pb-2">You solved the maze.</p>
                                <button
                                    onClick={resetProgram}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg active:scale-95"
                                >
                                    Play Again
                                </button>
                            </div>
                        )}

                        <div className="absolute bottom-2 w-full text-center text-xs text-white/20 font-bold tracking-[0.2em] pointer-events-none">
                            MAZE
                        </div>
                    </div>
                </div>

                {/* Blockly Workspace */}
                <div ref={blocklyDiv} className="absolute inset-0 w-full h-full bg-[#0f0f0f]" />
            </div>
        </div>
    );
};

export default MazePage;
