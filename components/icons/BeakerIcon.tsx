import React from 'react';

export const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a4 4 0 00-5.656 0l-2.829 2.829a4 4 0 01-5.656-5.656l2.829-2.829a4 4 0 005.656 0l5.656 5.656z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5V21m0-18v2.5M4.929 4.929l1.414 1.414M17.657 17.657l1.414 1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h2.5m15 0H22m-8-3.5c.333-.333.667-.667 1-1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3V2m0 19v-1m-7-7H4m16 0h-1M5.636 5.636l-.707-.707M19.071 5.636l-.707.707" />
    </svg>
);