"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Wrench,
    HardHat,
    X,
    AlertCircle,
    RefreshCw,
    Loader2,
    Sparkles,
    Zap,
    ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function FeatureUnderConstruction() {
    const [isAnimating, setIsAnimating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pulse, setPulse] = useState(false)

    // Animation effects
    useEffect(() => {
        const pulseInterval = setInterval(() => {
            setPulse(prev => !prev)
        }, 2000)

        return () => clearInterval(pulseInterval)
    }, [])

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 1000)
        }, 800)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl" />

                {/* Animated Construction Lines */}
                <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: "200%", opacity: 1 }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                top: `${(i + 1) * 8}%`,
                                width: "100%",
                            }}
                        />
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Main Card */}
                <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                    <CardContent className="p-8">
                        {/* Status Indicator */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: isAnimating ? 360 : 0 }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                    >
                                        <HardHat className="h-8 w-8 text-amber-500" />
                                    </motion.div>
                                    <motion.div
                                        className="absolute -top-1 -right-1"
                                        animate={{ scale: pulse ? 1.2 : 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    </motion.div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">
                                        UNDER CONSTRUCTION
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                animate={{
                                    rotate: isAnimating ? [0, -10, 10, -10, 0] : 0,
                                    scale: isAnimating ? [1, 1.2, 1] : 1
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <X className="h-10 w-10 text-red-500 opacity-80" />
                            </motion.div>
                        </div>

                        {/* 404 Display */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-9xl font-black tracking-tighter bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
                                >
                                    404
                                </motion.div>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -right-4 -top-4"
                                >
                                    <Sparkles className="h-6 w-6 text-purple-500" />
                                </motion.div>
                            </div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-semibold mt-2 text-gray-900 dark:text-gray-100"
                            >
                                Feature Unavailable
                            </motion.p>
                        </div>

                        {/* Construction Message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4 mb-8"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                <p className="text-center text-gray-600 dark:text-gray-300">
                                    This feature is currently being{" "}
                                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                                        upgraded
                                    </span>
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Wrench className="h-5 w-5 text-blue-500" />
                                    </motion.div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            Coming Soon in{" "}
                                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                                                v2.0
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            We're working hard to bring this to you
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-4"
                        >
                            {/* Progress Indicator */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Construction Progress</span>
                                    <span className="font-medium">65%</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "65%" }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 group"
                                    onClick={() => window.history.back()}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                    Go Back
                                </Button>

                                <Button
                                    className="flex-1 group"
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform" />
                                    )}
                                    {isLoading ? "Checking..." : "Check Status"}
                                </Button>
                            </div>
                        </motion.div>

                        {/* Status Update Indicator */}
                        <AnimatePresence>
                            {isAnimating && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-4"
                                >
                                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                                        <Zap className="h-4 w-4 animate-pulse" />
                                        <span>Status updated - Still in progress</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Floating Elements */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-6 -left-6"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg rotate-12 shadow-lg flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-white" />
                    </div>
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute -bottom-4 -right-6"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center">
                        <div className="text-xs font-bold text-white">v2</div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Page Footer */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Estimated availability:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">Q2 2024</span>
                </p>
            </div>
        </div>
    )
}