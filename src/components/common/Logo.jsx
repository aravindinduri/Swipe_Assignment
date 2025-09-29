import React from 'react'

function Logo() {
    return (
        <div>
            <svg width="210" height="52" viewBox="0 0 210 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#14B8A6;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M4 26 L 10 26 L 10 16 L 16 16 L 16 36 L 22 36 L 22 22 L 28 22 L 28 30 L 34 30 L 34 20 L 40 38 L 48 8" stroke="url(#grad2)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

                <text x="60" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="bold" fill="#E5E7EB">
                    Crisp
                </text>
            </svg>

        </div>
    )
}

export default Logo
