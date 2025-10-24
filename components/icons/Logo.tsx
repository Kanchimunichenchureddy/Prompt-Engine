import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#paint0_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12M22 7L12 12M12 22V12" stroke="url(#paint1_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 4.5L7 9.5" stroke="url(#paint2_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa"/>
                <stop offset="1" stopColor="#a855f7"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa"/>
                <stop offset="1" stopColor="#a855f7"/>
            </linearGradient>
             <linearGradient id="paint2_linear_1_2" x1="7" y1="4.5" x2="17" y2="9.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa"/>
                <stop offset="1" stopColor="#a855f7"/>
            </linearGradient>
        </defs>
    </svg>
);