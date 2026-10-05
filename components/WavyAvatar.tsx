import type { StaticImageData } from 'next/image';
import { useId } from 'react';

type WavyAvatarProps = {
   src: string | StaticImageData;
   size?: number;
   strokeColor?: string;
   strokeWidth?: number;
   duration?: string;
   wavy?: boolean;
   rotate?: boolean;
   round?: boolean;
};

const wavyPath = (() => {
   const pointCount = 256;
   const points = Array.from({ length: pointCount }, (_, index) => {
      const angle = (index / pointCount) * Math.PI * 2 - Math.PI / 2;
      const radius = 100 + 3.5 * Math.cos(11 * angle); // Adjust for better curve and smoothness

      return {
         x: 100 + radius * Math.cos(angle),
         y: 100 + radius * Math.sin(angle),
      };
   });

   return points.reduce((path, point, index) => {
      const previous = points[(index - 1 + pointCount) % pointCount];
      const next = points[(index + 1) % pointCount];
      const afterNext = points[(index + 2) % pointCount];
      const control1 = {
         x: point.x + (next.x - previous.x) / 6,
         y: point.y + (next.y - previous.y) / 6,
      };
      const control2 = {
         x: next.x - (afterNext.x - point.x) / 6,
         y: next.y - (afterNext.y - point.y) / 6,
      };
      const segment = `C ${control1.x},${control1.y} ${control2.x},${control2.y} ${next.x},${next.y}`;

      return index === 0 ? `M ${point.x},${point.y} ${segment}` : `${path} ${segment}`;
   }, '') + ' Z';
})();

const WavyAvatar = ({
   src,
   size = 300,
   strokeColor = '#f5c6cb',
   strokeWidth = 10,
   duration = '10s',
   wavy = true,
   rotate = false,
   round = false,
}: WavyAvatarProps) => {
   const imageSrc = typeof src === 'string' ? src : src.src;
   const clipPathId = `wavy-clip-${useId().replace(/:/g, '')}`;
   const animationClassName = rotate ? 'rotating-wavy' : undefined;

   return (
      <div style={{ width: size, height: size, position: 'relative' }}>
         <svg
            viewBox="0 0 200 200"
            width={size}
            height={size}
            style={{ overflow: 'visible', paddingRight: '10px' }}
         >
            <defs>
               {/* 1. Image clip korar jonno clipPath */}
               <clipPath id={clipPathId}>
                  {round ? (
                     <circle
                        cx="100"
                        cy="100"
                        r="100"
                        className={animationClassName}
                        style={{ animationDuration: duration }}
                     />
                  ) : (
                     <path
                        d={wavyPath}
                        className={animationClassName}
                        style={{ animationDuration: duration }}
                     />
                  )}
               </clipPath>
            </defs>

            {/* 2. Clipped Image */}
            {/*//! Adjust x and y if there are gap in left and top */}
            {/*//! Adjust width and height if there are gap in bottom and right */}
            <image
               href={imageSrc}
               x="-4"
               y="-4"
               width="210"
               height="210"
               preserveAspectRatio="xMidYMid slice"
               clipPath={`url(#${clipPathId})`}
            />

            {/* 3. Wavy Stroke / Border */}
            {round ? (
               <circle
                  cx="100"
                  cy="100"
                  r="100"
                  fill="none"
                  stroke={wavy ? strokeColor : 'transparent'}
                  strokeWidth={strokeWidth}
                  className={animationClassName}
                  style={{ animationDuration: duration }}
               />
            ) : (
               <path
                  d={wavyPath}
                  fill="none"
                  stroke={wavy ? strokeColor : 'transparent'}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={animationClassName}
                  style={{ animationDuration: duration }}
               />
            )}
         </svg>
      </div>
   );
};

export default WavyAvatar;
