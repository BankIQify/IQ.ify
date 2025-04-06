import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedAchievementProps {
  src: string;
  alt: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const AnimatedAchievement = ({
  src,
  alt,
  className,
  autoPlay = true,
  loop = true,
  onLoad,
  onError,
}: AnimatedAchievementProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('Attempting to load media from:', src);
    
    if (videoRef.current) {
      const video = videoRef.current;

      const handleLoad = () => {
        console.log('Media loaded successfully');
        setIsLoaded(true);
        onLoad?.();
      };

      const handleError = (e: Event) => {
        const target = e.target as HTMLVideoElement;
        const error = target.error;
        const errorMsg = error ? `Error: ${error.message}` : 'Unknown error occurred';
        console.error('Media loading error:', errorMsg);
        console.error('Error details:', error);
        setErrorMessage(errorMsg);
        setHasError(true);
        onError?.();
      };

      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('error', handleError);

      // Test if the file exists
      fetch(src)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log('File exists and is accessible');
        })
        .catch(error => {
          console.error('File fetch error:', error);
          setErrorMessage(`File not found or inaccessible: ${error.message}`);
          setHasError(true);
        });

      return () => {
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('error', handleError);
      };
    }
  }, [src, onLoad, onError]);

  // If it's not an MP4, fallback to image
  if (!src.toLowerCase().endsWith('.mp4')) {
    console.log('Non-MP4 file detected, falling back to image');
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'rounded-lg object-cover transition-opacity duration-300',
          !isLoaded && 'opacity-0',
          className
        )}
        onLoad={() => {
          console.log('Image loaded successfully');
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={(e) => {
          const target = e.currentTarget;
          console.error('Image loading error:', target.src);
          setHasError(true);
          onError?.();
        }}
      />
    );
  }

  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)}>
      <video
        ref={videoRef}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          !isLoaded && 'opacity-0'
        )}
        autoPlay={autoPlay}
        loop={loop}
        muted
        playsInline
        controls={hasError} // Show controls if there's an error
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading media...</p>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-4">
          <p className="text-sm text-destructive font-medium mb-2">Failed to load media</p>
          <p className="text-xs text-muted-foreground text-center">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}; 