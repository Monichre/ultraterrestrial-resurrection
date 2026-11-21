"use client";

/**
 * @author: @dorian_baffier
 * @description: Smooth Drawer
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Fingerprint } from "lucide-react";

interface PriceTagProps {
    price: number;
    discountedPrice: number;
}

function PriceTag({ price, discountedPrice }: PriceTagProps) {
    return (
        <div className="flex items-center justify-around gap-4 max-w-fit mx-auto">
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                    ${discountedPrice}
                </span>
                <span className="text-lg line-through text-zinc-400 dark:text-zinc-500">
                    ${price}
                </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Lifetime access
                </span>
                <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    One-time payment
                </span>
            </div>
        </div>
    );
}

interface DrawerDemoProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    price?: number;
    discountedPrice?: number;
}

const drawerVariants = {
    hidden: {
        y: "100%",
        opacity: 0,
        rotateX: 5,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    visible: {
        y: 0,
        opacity: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
            staggerChildren: 0.07,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: {
        y: 20,
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
        },
    },
};

export default function SmoothDrawer({
    title = "KokonutUI - Pro",
    description = "100+ collection of UI Components and templates built for React, Next.js, Tailwind CSS. Spend no time on design focus shipping.",
    primaryButtonText = "Buy Now",
    secondaryButtonText = "Maybe Later",
    onSecondaryAction,
    price = 169,
    discountedPrice = 99,
}: DrawerDemoProps) {
    const handleSecondaryClick = () => {
        onSecondaryAction?.();
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent className="max-w-fit mx-auto p-6 rounded-2xl shadow-xl">
                <motion.div
                    variants={drawerVariants as any}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto w-full max-w-[340px] space-y-6"
                >
                    <motion.div variants={itemVariants as any}>
                        <DrawerHeader className="px-0 space-y-2.5">
                            <DrawerTitle className="text-2xl font-semibold flex items-center gap-2.5 tracking-tighter">
                                <motion.div variants={itemVariants as any}>
                                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 shadow-inner">
                                        <Image
                                            src="/logo.svg"
                                            alt="Logo"
                                            width={32}
                                            height={32}
                                            className="hidden dark:block"
                                        />
                                        <Image
                                            src="/logo-black.svg"
                                            alt="Logo"
                                            width={32}
                                            height={32}
                                            className="block dark:hidden"
                                        />
                                    </div>
                                </motion.div>
                                <motion.span variants={itemVariants as any}>
                                    {title}
                                </motion.span>
                            </DrawerTitle>
                            <motion.div variants={itemVariants as any}>
                                <DrawerDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 tracking-tighter">
                                    {description}
                                </DrawerDescription>
                            </motion.div>
                        </DrawerHeader>
                    </motion.div>

                    <motion.div variants={itemVariants as any}>
                        <PriceTag
                            price={price}
                            discountedPrice={discountedPrice}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants as any}>
                        <DrawerFooter className="flex flex-col gap-3 px-0">
                            <div className="w-full">
                                <Link
                                    href="https://kokonutui.pro/#pricing"
                                    target="_blank"
                                    className="group w-full relative overflow-hidden inline-flex items-center justify-center h-11 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-600 dark:to-pink-600 text-white text-sm font-semibold tracking-wide shadow-lg shadow-rose-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-rose-500/30 hover:from-rose-600 hover:to-pink-600 dark:hover:from-rose-500 dark:hover:to-pink-500"
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%]"
                                        whileHover={{
                                            x: ["-200%", "200%"],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            ease: "easeInOut",
                                            repeat: 0,
                                        }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative flex items-center gap-2 tracking-tighter"
                                    >
                                        {primaryButtonText}
                                        <motion.div
                                            animate={{
                                                rotate: [0, 15, -15, 0],
                                                y: [0, -2, 2, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                ease: "easeInOut",
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatDelay: 1,
                                            }}
                                        >
                                            <Fingerprint className="w-4 h-4" />
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            </div>
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={handleSecondaryClick}
                                    className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-sm font-semibold transition-colors tracking-tighter"
                                >
                                    {secondaryButtonText}
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </motion.div>
                </motion.div>
            </DrawerContent>
        </Drawer>
    );
}
