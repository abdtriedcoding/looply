"use client"

import Image from "next/image"
import { useState } from "react"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { cn } from "@/lib/utils"

interface ThumbnailProps {
  url: string[]
  alt?: string
  className?: string
}

export function Thumbnail({
  url: images,
  alt = "Image",
  className,
}: ThumbnailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isMultiple = images.length > 1
  const firstImage = images[0]

  if (images.length === 0) {
    return null
  }

  function ThumbnailContent() {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        <Image
          src={firstImage}
          alt={alt}
          width={200}
          height={200}
          className="h-48 w-48 cursor-pointer object-cover transition-all duration-200 hover:scale-105"
        />
        {isMultiple && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
              +{images.length - 1}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer pt-1">
          <ThumbnailContent />
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] max-w-4xl border-none bg-black/95 p-0"
        showCloseButton={false}
      >
        <div className="relative h-full w-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setIsModalOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <Carousel className="h-full w-full">
            <CarouselContent className="h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="flex h-full items-center justify-center p-0">
                    <Image
                      src={image}
                      alt={`${alt} ${index + 1}`}
                      width={800}
                      height={600}
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {isMultiple && (
              <>
                <CarouselPrevious className="left-4 border-none bg-black/50 text-white hover:bg-black/70" />
                <CarouselNext className="right-4 border-none bg-black/50 text-white hover:bg-black/70" />
              </>
            )}
          </Carousel>

          {isMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {images.length} images
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
