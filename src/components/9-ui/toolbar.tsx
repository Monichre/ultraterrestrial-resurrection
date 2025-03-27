"use client"

import * as React from "react"
import { Toolbar as BaseToolbar } from "@base-ui-components/react/toolbar"

import { ButtonProps, buttonVariants } from "@/components/ui/button"

import { cn } from "@/utils"

const Toolbar = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>
>(({ className, ...props }, ref) => {
	return (
		<BaseToolbar.Root
			className={cn(
				"flex items-center gap-1 rounded-md border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-950",
				className
			)}
			{...props}
			ref={ref}
		/>
	)
})
Toolbar.displayName = "Toolbar"

const ToolbarButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof BaseToolbar.Button> & ButtonProps
>(({ className, variant, size, ...props }, ref) => {
	return (
		<BaseToolbar.Button
			className={cn(
				buttonVariants({ variant: variant ?? "ghost", size: size ?? "md" }),
				"shrink-0",
				className
			)}
			{...props}
			ref={ref}
		/>
	)
})
ToolbarButton.displayName = "ToolbarButton"

const ToolbarSeparator = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof BaseToolbar.Separator>
>((props, ref) => {
	return (
		<BaseToolbar.Separator
			className={cn("h-6 w-px shrink-0 bg-gray-100 dark:bg-gray-800")}
			{...props}
			ref={ref}
		/>
	)
})
ToolbarSeparator.displayName = "ToolbarSeparator"

const ToolbarInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<typeof BaseToolbar.Input>
>((props, ref) => {
	return <BaseToolbar.Input {...props} ref={ref} />
})
ToolbarInput.displayName = "ToolbarInput"

const ToolbarGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof BaseToolbar.Group>
>(({ className, ...props }, ref) => {
	return (
		<BaseToolbar.Group
			className={cn("flex items-center gap-1", className)}
			{...props}
			ref={ref}
		/>
	)
})
ToolbarGroup.displayName = "ToolbarGroup"

const ToolbarLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<typeof BaseToolbar.Link>
>(({ className, ...props }, ref) => {
	return (
		<BaseToolbar.Link
			ref={ref}
			className={cn(
				"inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm text-gray-500 no-underline transition-colors hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 [&>svg]:shrink-0 dark:text-gray-400 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300",
				className
			)}
			{...props}
		/>
	)
})
ToolbarLink.displayName = "ToolbarLink"

export {
	Toolbar,
	ToolbarButton,
	ToolbarSeparator,
	ToolbarInput,
	ToolbarGroup,
	ToolbarLink,
}
