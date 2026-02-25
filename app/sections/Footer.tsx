import React from 'react'

type Props = {}

const Footer = (props: Props) => {
    return (
        <footer className="border-t mt-24">
            <div className="mx-6 md:mx-20 py-10 flex flex-col md:flex-row
                      items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <p className="text-sm font-medium">
                        Blockly Games — Modern Reimplementation
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        An educational project built using Google Blockly
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    )
}

export default Footer