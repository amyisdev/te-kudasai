import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarDiceBear({
  className,
  variant = 'bottts',
  seed = '',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
  variant?: 'bottts' | 'icons' | 'identicon' | 'rings'
  seed?: string
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      src={`https://api.dicebear.com/9.x/${variant}/svg?seed=${seed}`}
      {...props}
    />
  )
}

function AvatarFallbackInitials({
  className,
  name = '',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  name?: string
}) {
  const initials = name.split(' ').map((n) => n[0]).join('')
  return (
    <AvatarPrimitive.Fallback className={cn(className)} {...props}>
      {initials}
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarDiceBear, AvatarFallbackInitials }
