import { forwardRef } from 'react';
import type { HTMLAttributes, ImgHTMLAttributes } from 'react';

import Image from 'next/image';

import { cn } from '@/shared/lib/utils';

const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
                className,
            )}
            {...props}
        />
    ),
);
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
    ({ className, src, alt = 'Avatar' }, ref) => {
        if (!src) return null;
        return (
            <Image
                ref={ref}
                src={src as string}
                alt={alt}
                fill
                sizes="40px"
                className={cn('aspect-square h-full w-full object-cover', className)}
            />
        );
    },
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'bg-muted flex h-full w-full items-center justify-center rounded-full',
                className,
            )}
            {...props}
        />
    ),
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
