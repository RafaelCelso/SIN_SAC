import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
))
Timeline.displayName = "Timeline"

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex", className)} {...props} />
))
TimelineItem.displayName = "TimelineItem"

interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineSeparator = React.forwardRef<HTMLDivElement, TimelineSeparatorProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col items-center mr-4", className)} {...props} />
))
TimelineSeparator.displayName = "TimelineSeparator"

interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "amber"
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, color = "blue", ...props }, ref) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      amber: "bg-amber-500",
    }

    return (
      <div
        ref={ref}
        className={cn("h-4 w-4 rounded-full border-4 border-background", colorClasses[color], className)}
        {...props}
      />
    )
  },
)
TimelineDot.displayName = "TimelineDot"

interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-0.5 bg-border grow my-1", className)} {...props} />
))
TimelineConnector.displayName = "TimelineConnector"

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pb-6 pt-1", className)} {...props} />
))
TimelineContent.displayName = "TimelineContent"

interface TimelineHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center justify-between", className)} {...props} />
))
TimelineHeader.displayName = "TimelineHeader"

interface TimelineTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-medium", className)} {...props} />
))
TimelineTitle.displayName = "TimelineTitle"

export {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
}

