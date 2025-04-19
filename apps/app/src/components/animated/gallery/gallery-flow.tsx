"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface GalleryFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  images: {
    src: string;
    alt?: string;
    caption?: string;
  }[];
  variant?: "flow" | "fade" | "slide" | "stack";
  thumbnailPosition?: "bottom" | "left" | "right";
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showThumbnails?: boolean;
  showDots?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  fillMode?: "cover" | "contain";
  thumbnailSize?: "sm" | "md" | "lg";
  loop?: boolean;
}

const GalleryFlow = React.forwardRef<HTMLDivElement, GalleryFlowProps>(
  (
    {
      images,
      variant = "flow",
      thumbnailPosition = "bottom",
      autoPlay = false,
      interval = 3000,
      showArrows = true,
      showThumbnails = true,
      showDots = false,
      aspectRatio = "video",
      fillMode = "cover",
      thumbnailSize = "md",
      loop = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [slideDirection, setSlideDirection] = React.useState<1 | -1>(1);
    const dragX = useSpring(0, { stiffness: 300, damping: 30 });
    const opacity = useTransform(dragX, [-100, 0, 100], [0.5, 1, 0.5]);

    // Auto-play functionality
    React.useEffect(() => {
      if (!autoPlay || isHovered || isDragging) return;

      const timer = setInterval(() => {
        if (currentIndex === images.length - 1 && !loop) {
          clearInterval(timer);
          return;
        }
        setSlideDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }, [
      autoPlay,
      currentIndex,
      images.length,
      interval,
      isHovered,
      isDragging,
      loop,
    ]);

    const handleNext = () => {
      if (currentIndex === images.length - 1 && !loop) return;
      setSlideDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
      if (currentIndex === 0 && !loop) return;
      setSlideDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index: number) => {
      setSlideDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    };

    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => {
      setIsDragging(false);
      const threshold = 50;
      if (dragX.get() > threshold) handlePrev();
      if (dragX.get() < -threshold) handleNext();
      dragX.set(0);
    };

    const aspectRatioClass = {
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-3/4",
      auto: "aspect-auto",
    };

    const thumbnailSizeClass = {
      sm: "h-12 w-12",
      md: "h-16 w-16",
      lg: "h-20 w-20",
    };

    const thumbnailContainerClass = {
      bottom: "flex-row justify-center space-x-2 mt-2",
      left: "flex-col space-y-2 mr-2",
      right: "flex-col space-y-2 ml-2",
    };

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-lg",
            aspectRatioClass[aspectRatio],
          )}
        >
          <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
            <motion.div
              key={currentIndex}
              className="absolute inset-0"
              custom={slideDirection}
              initial={(() => {
                switch (variant) {
                  case "slide":
                    return {
                      x: slideDirection * 1000,
                      opacity: 0,
                      scale: 0.8,
                    };
                  case "fade":
                    return { opacity: 0 };
                  case "stack":
                    return {
                      opacity: 0,
                      scale: 0.8,
                      rotateY: 45,
                      z: -200,
                    };
                  default: // flow
                    return { opacity: 0 };
                }
              })()}
              animate={(() => {
                switch (variant) {
                  case "slide":
                    return {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.3 },
                      },
                    };
                  case "fade":
                    return { opacity: 1 };
                  case "stack":
                    return {
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                      z: 0,
                    };
                  default: // flow
                    return { opacity: 1 };
                }
              })()}
              exit={(() => {
                switch (variant) {
                  case "slide":
                    return {
                      x: slideDirection * -1000,
                      opacity: 0,
                      scale: 0.8,
                      transition: {
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.3 },
                      },
                    };
                  case "fade":
                    return { opacity: 0 };
                  case "stack":
                    return {
                      opacity: 0,
                      scale: 0.8,
                      rotateY: -45,
                      z: -200,
                    };
                  default: // flow
                    return { opacity: 0 };
                }
              })()}
              transition={(() => {
                switch (variant) {
                  case "slide":
                    return {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 0.8,
                      velocity: 50,
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                    };
                  case "fade":
                    return {
                      duration: 0.5,
                      ease: "easeInOut",
                    };
                  case "stack":
                    return {
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                      opacity: { duration: 0.3 },
                    };
                  default: // flow
                    return {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    };
                }
              })()}
              drag={variant === "flow" ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{
                x: variant === "flow" ? dragX : undefined,
                opacity: variant === "flow" ? opacity : undefined,
                perspective: variant === "stack" ? 1000 : undefined,
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            >
              <motion.div
                className="h-full w-full"
                style={{
                  position: "relative",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
                  fill
                  quality={75}
                  priority={false}
                  className={cn(
                    "h-full w-full",
                    fillMode === "cover" ? "object-cover" : "object-contain",
                  )}
                />
                {images[currentIndex].caption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute inset-x-0 bottom-0 bg-black/50 p-4 text-white"
                  >
                    <p className="text-sm">{images[currentIndex].caption}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {showArrows && (
            <>
              <button
                onClick={handlePrev}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-xs transition-all hover:bg-black/40",
                  !loop &&
                    currentIndex === 0 &&
                    "cursor-not-allowed opacity-50",
                )}
                disabled={!loop && currentIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-xs transition-all hover:bg-black/40",
                  !loop &&
                    currentIndex === images.length - 1 &&
                    "cursor-not-allowed opacity-50",
                )}
                disabled={!loop && currentIndex === images.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {showDots && (
          <div className="mt-4 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentIndex
                    ? "scale-125 bg-primary"
                    : "bg-gray-300 hover:bg-gray-400",
                )}
              />
            ))}
          </div>
        )}

        {showThumbnails && (
          <div
            className={cn(
              "flex",
              thumbnailContainerClass[thumbnailPosition],
              thumbnailPosition === "bottom" ? "mt-2" : "",
            )}
          >
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  thumbnailSizeClass[thumbnailSize],
                  "relative overflow-hidden rounded-lg transition-all",
                  index === currentIndex
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  quality={75}
                  priority={false}
                  className="h-full w-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

GalleryFlow.displayName = "GalleryFlow";

export GalleryFlow;
// https://artifactui.in/docs/components/gallery-flow