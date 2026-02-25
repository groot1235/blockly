"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Check, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import * as Blockly from "blockly";
import DarkTheme from "@blockly/theme-dark";
import { javascriptGenerator } from "blockly/javascript";
import "@/lib/blocks/birdBlocks";

const BirdPage = () => {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    // Game state
    const [birdPos, setBirdPos] = useState({ x: 20, y: 80 });
    const [wormPos] = useState({ x: 80, y: 20 });
    const [hasWorm, setHasWorm] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);

    // Store active interval token
    const loopRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!blocklyDiv.current) return;

        const workspace = Blockly.inject(blocklyDiv.current, {
            toolbox: `
     <xml>  
       <block type="bird_heading"></block>
       <block type="bird_noWorm"></block>
       <block type="controls_if"></block>
       <block type="math_number"></block>
       <block type="bird_compare">
         <field name="OP">LT</field>
         <value name="A">
           <block type="bird_position">
             <field name="XY">X</field>
           </block>
         </value>
         <value name="B">
           <block type="math_number">
             <field name="NUM">50</field>
           </block>
         </value>
       </block>
       <block type="bird_position"></block>
       <block type="bird_and"></block>
     </xml>`,
            theme: DarkTheme,
            move: {
                scrollbars: true,
                drag: true,
                wheel: true
            }
        });

        workspaceRef.current = workspace;

        return () => {
            workspace.dispose();
            if (loopRef.current) clearInterval(loopRef.current);
        };
    }, []);

    const playProgram = () => {
        if (!workspaceRef.current) return;
        if (isRunning) return;
        setIsRunning(true);
        setShowCongrats(false);

        const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

        // Simulation variables
        let bX = 20;
        let bY = 80;
        let gotWorm = false;

        loopRef.current = setInterval(() => {
            let currentHeading: number | null = null;

            // API mapping for the JS evaluated from Blockly
            const noWorm = () => !gotWorm;
            const getX = () => bX;
            const getY = () => 100 - bY; // map coordinate (y is 0 at bottom)
            const heading = (angle: number) => { currentHeading = angle; };

            try {
                // Safely evaluate the generated blockly syntax in this scope
                eval(code);
            } catch (e) {
                console.error("Error executing Blockly code", e);
                clearInterval(loopRef.current!);
                setIsRunning(false);
                return;
            }

            if (currentHeading !== null) {
                // Trigonometry to move bird based on heading angle
                const rad = currentHeading * (Math.PI / 180);
                bX += Math.cos(rad) * 1;    // 1 unit speed
                bY -= Math.sin(rad) * 1;    // minus because DOM Y is top-down
            }

            // Check if bird caught worm (within radius 4)
            if (Math.hypot(bX - wormPos.x, bY - wormPos.y) < 4) {
                if (!gotWorm) {
                    gotWorm = true;
                    setBirdPos({ x: bX, y: bY });
                    setHasWorm(true);
                    clearInterval(loopRef.current!);
                    setIsRunning(false);
                    setShowCongrats(true);
                    return;
                }
            }

            // End bounds
            if (bX < 0 || bX > 100 || bY < 0 || bY > 100) {
                clearInterval(loopRef.current!);
                setIsRunning(false);
                alert("The bird flew off the map! Try again.");
                return;
            }

            setBirdPos({ x: bX, y: bY });
            setHasWorm(gotWorm);
        }, 30);
    };

    const resetProgram = () => {
        if (loopRef.current) clearInterval(loopRef.current);
        setIsRunning(false);
        setBirdPos({ x: 20, y: 80 });
        setHasWorm(false);
        setShowCongrats(false);
    };

    return (
        <div className="h-screen flex flex-col bg-[#0f0f0f] text-white overflow-hidden">
            {/* Custom Blockly CSS overrides for layout */}
            <style dangerouslySetInnerHTML={{
                __html: `
                /* Shift the flyout down beneath the game map and right by 16px so left tabs aren't cropped */
                .blocklyFlyout {
                    transform: translate(16px, 400px) !important;
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
                <h1 className="text-xl font-semibold pl-10 tracking-wide text-white/90">Bird</h1>
                <p className="text-white/50 text-sm ml-6">
                    Control the bird to get the worm and head to the nest
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

                        {/* The Blue Bird Dot */}
                        <div
                            className="absolute w-6 h-6 bg-[#3b82f6] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center text-[10px] font-bold text-white transition-all duration-75 transform -translate-x-1/2 -translate-y-1/2 z-20"
                            style={{
                                left: `${birdPos.x}%`,
                                top: `${birdPos.y}%`
                            }}
                        >
                            B
                        </div>

                        {/* The Red Worm Dot (Hides if bird eats it) */}
                        {!hasWorm && (
                            <div
                                className="absolute w-4 h-4 bg-[#ef4444] rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] flex items-center justify-center text-[8px] font-bold text-white transition-all transform animate-pulse -translate-x-1/2 -translate-y-1/2 z-10"
                                style={{
                                    left: `${wormPos.x}%`,
                                    top: `${wormPos.y}%`
                                }}
                            >
                                W
                            </div>
                        )}

                        {showCongrats && (
                            <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center gap-2 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
                                <span className="text-4xl drop-shadow-md mb-2">🎉</span>
                                <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">Congratulations!</h2>
                                <p className="text-sm text-white/80 font-medium pb-2">You successfully caught the worm.</p>
                                <button
                                    onClick={resetProgram}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg active:scale-95"
                                >
                                    Play Again
                                </button>
                            </div>
                        )}

                        <div className="absolute bottom-2 w-full text-center text-xs text-white/40 font-bold tracking-[0.2em] pointer-events-none">
                            MAP
                        </div>
                    </div>
                </div>

                {/* Blockly Workspace */}
                <div ref={blocklyDiv} className="absolute inset-0 w-full h-full bg-[#0f0f0f]" />
            </div>
        </div>
    );
};

export default BirdPage;
