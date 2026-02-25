"use client";
import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { Check } from "lucide-react";
import Link from "next/link";
import * as Blockly from "blockly";
import "@/lib/blocks/puzzleBlocks";


const PuzzlePage = () => {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!blocklyDiv.current) return;

        const workspace = Blockly.inject(blocklyDiv.current, {
            toolbox: `
     <xml>  
       <block type="puzzle_animal"></block>
       <block type="puzzle_picture"></block>
       <block type="trait_whiskers"></block>
       <block type="trait_fur"></block>
       <block type="trait_honey"></block>
       <block type="trait_stinger"></block>
       <block type="trait_beak"></block>
       <block type="trait_feathers"></block>
       <block type="trait_slime"></block>
       <block type="trait_shell"></block>
     </xml>`,
        });

        return () => {
            workspace.dispose();
        };
    }, []);


    return (
        <div className="h-screen flex flex-col">
            <div className="p-6 border-b border-white/10 flex px-10 items-center">

                <div className="flex items-center gap-1 px-1 py-1 bg-white/5 border border-white/10 rounded-xl">
                    <Link
                        href="/dashboard"
                        className="p-1 rounded-lg active:scale-95 transition"
                    >
                        <ChevronLeft className="w-4 h-4 text-white/70" />
                    </Link>

                    <div className="w-px h-4 bg-white/10" />

                    <button
                        className="p-1 rounded-lg active:scale-95 transition"
                    >
                        <Check className="w-4 h-4 text-white/80" />
                    </button>


                </div>

                <h1 className="text-2xl font-semibold pl-20">Puzzle</h1>
                <p className="text-muted-foreground mt-1 pl-10">
                    Match the animal to its picture, number of legs, and traits
                </p>
            </div>
            <div className="flex-1 p-6 flex gap-6">
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="aspect-square bg-[#0f0f0f] rounded-xl border border-white/10 relative overflow-hidden">
                        {/* Placeholder for Puzzle Game Results */}
                        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm text-center px-4">
                            Match traits correctly and click Check Answers
                        </div>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 text-white rounded-lg py-3 font-semibold transition">
                        Check Answers
                    </button>
                    <button className="bg-transparent border border-white/10 hover:bg-white/5 text-white/70 rounded-lg py-3 font-semibold transition">
                        Reset
                    </button>
                </div>
                <div
                    ref={blocklyDiv}
                    className="flex-1 h-full rounded-xl border border-white/10 bg-[#0f0f0f]"
                />
            </div>

        </div>
    );
};

export default PuzzlePage;
