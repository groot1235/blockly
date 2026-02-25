import { useState } from "react";
import { ChevronDown } from "lucide-react";



export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            q: "What is Blockly Games?",
            a: "Blockly Games is an educational platform that teaches programming concepts using visual, block-based coding through interactive games.",
        },
        {
            q: "Do I need prior coding experience?",
            a: "No. The platform is designed for beginners and focuses on logic and problem-solving without requiring knowledge of syntax.",
        },
        {
            q: "What programming concepts can I learn?",
            a: "You’ll learn sequencing, loops, conditionals, functions, and basic algorithmic thinking through different games.",
        },
        {
            q: "Do I need to install anything to use Blockly?",
            a: "No. Blockly works directly in your browser, so you can start learning instantly without any setup or installation.",
        },
        {
            q: "How does Blockly help me become a better programmer?",
            a: "By visualizing logic step-by-step, Blockly trains your thinking process, making it much easier to transition to real-world coding later.",
        },
    ];

    return (
        <div className="mx-6 md:mx-20 py-32">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
                Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((item, index) => (
                    <div
                        key={index}
                        className="border-b border-white/10 p-5"
                    >
                        <div
                            onClick={() => toggle(index)}
                            className="cursor-pointer flex items-center justify-between
           transition-all duration-200 hover:text-indigo-400"
                        >
                            {item.q}
                            <ChevronDown
                                className={`h-5 w-5 text-muted-foreground transition-transform duration-200
      ${openIndex === index ? "rotate-180" : ""}`}
                            />
                        </div>

                        {openIndex === index && (
                            <p className="text-muted-foreground mt-2">{item.a}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
