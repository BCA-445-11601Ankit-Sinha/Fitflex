import React from "react";
import Link from "next/link";
import ProductImageCarousel from "@/components/ProductImageCarousel"; 
import { getExerciseBySlug } from "@/APIs/exerciseAPIs";
import AdminWorkoutEditAction from "@/components/AdminWorkoutEditAction";

// Add type definition for the exercise data
interface Exercise {
    _id: string;
    name: string;
    slug: string;
    description: string;
    difficulty: string;
    muscleGroup: string;
    targetMuscle: string[];
    imageUrl: string[];
    videoUrl?: string[];
    process: string;
    set: string;
    createdAt: string;
    updatedAt: string;
}

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string) => {
    // Handle different YouTube URL formats:
    // - Standard: https://www.youtube.com/watch?v=VIDEO_ID
    // - Shorts: https://youtube.com/shorts/VIDEO_ID
    // - Shorts with params: https://youtube.com/shorts/VIDEO_ID?si=PARAMS
    // - youtu.be: https://youtu.be/VIDEO_ID
    // - Embed: https://www.youtube.com/embed/VIDEO_ID
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&?#%]+)/,
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            // Handle different match group positions
            const videoId = match[1]?.length === 11 ? match[1] : match[2];
            if (videoId && videoId.length === 11) {
                return videoId;
            }
        }
    }
    
    return null;
};

// Helper function to check if URL is a YouTube URL
const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper function to get proper YouTube embed URL
const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        // Add parameters for better mobile/shorts experience
        return `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1&controls=1&loop=0`;
    }
    return null;
};

export default async function ExerciseDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const { data } = await getExerciseBySlug(slug);
    
    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-12 border border-gray-200 shadow-xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Exercise Not Found</h2>
                    <p className="text-gray-600 mb-6">The exercise you're looking for doesn't exist.</p>
                    <Link 
                        href="/exercises" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Exercises
                    </Link>
                </div>
            </div>
        );
    }

    const exercise: Exercise = data;

    // Helper function to get difficulty color and icon (updated for light theme)
    const getDifficultyDetails = (difficulty: string) => {
        switch(difficulty.toLowerCase()) {
            case 'beginner':
                return {
                    color: 'from-green-400 to-emerald-500',
                    bg: 'bg-green-100',
                    text: 'text-green-700',
                    icon: '🌱',
                    label: 'Beginner Friendly'
                };
            case 'intermediate':
                return {
                    color: 'from-yellow-400 to-orange-500',
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-700',
                    icon: '⚡',
                    label: 'Intermediate'
                };
            case 'advanced':
                return {
                    color: 'from-red-400 to-pink-500',
                    bg: 'bg-red-100',
                    text: 'text-red-700',
                    icon: '🔥',
                    label: 'Advanced'
                };
            default:
                return {
                    color: 'from-gray-400 to-gray-500',
                    bg: 'bg-gray-100',
                    text: 'text-gray-700',
                    icon: '💪',
                    label: difficulty
                };
        }
    };

    const difficultyDetails = getDifficultyDetails(exercise.difficulty);
    
    // Get YouTube embed URL if the video is from YouTube
    const videoUrl = exercise.videoUrl && exercise.videoUrl.length > 0 ? exercise.videoUrl[0] : null;
    const isYouTube = videoUrl ? isYouTubeUrl(videoUrl) : false;
    const youTubeEmbedUrl = videoUrl && isYouTube ? getYouTubeEmbedUrl(videoUrl) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section with Light Theme */}
            <div className="relative overflow-hidden">
                {/* Animated Background Elements - Light theme version */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Navigation with Light Theme */}
                    <div className="mb-8">
                        <Link 
                            href="/exercises" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-md text-gray-700 rounded-full hover:shadow-lg transition-all duration-200 border border-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Exercises
                        </Link>
                    </div>

                    {/* Exercise Title with Light Theme */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className={`text-4xl animate-bounce`}>{difficultyDetails.icon}</span>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${difficultyDetails.color} text-white shadow-lg`}>
                                {difficultyDetails.label}
                            </span>
                        </div>
                        <div className="mb-4 flex justify-center">
                            <AdminWorkoutEditAction workoutId={exercise._id} slug={exercise.slug} />
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-4 tracking-tight">
                            {exercise.name}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {exercise.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Image and Video Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Image Carousel Card - Light Theme */}
                    <div className="group relative bg-white rounded-3xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-3xl">📸</span>
                            Exercise Guide
                        </h2>
                        {exercise.imageUrl && exercise.imageUrl.length > 0 ? (
                            <ProductImageCarousel 
                                images={exercise.imageUrl}
                                productName={exercise.name}
                            />
                        ) : (
                            <div className="w-full h-[400px] lg:h-[500px] rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">No images available</p>
                            </div>
                        )}
                    </div>

                    {/* Video Card - Updated for YouTube Shorts with Light Theme */}
                    {videoUrl && (
                        <div className="group relative bg-white rounded-3xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-3xl">🎥</span>
                                Video Tutorial
                                {isYouTube && (
                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                        </svg>
                                        YouTube Short
                                    </span>
                                )}
                            </h2>
                            
                            {/* Video Container - Optimized for YouTube Shorts */}
                            <div className="relative w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                                <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
                                    {isYouTube && youTubeEmbedUrl ? (
                                        // YouTube Shorts Embed
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`${youTubeEmbedUrl}`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; muted; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        // Regular video player for non-YouTube videos
                                        <video 
                                            controls
                                            playsInline
                                            className="absolute inset-0 w-full h-full object-cover"
                                            poster={exercise.imageUrl[0]}
                                        >
                                            <source src={videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            </div>

                            {/* Video Info Banner */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                    {isYouTube ? (
                                        <>
                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                            </svg>
                                            Watch on YouTube Shorts
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Video Tutorial
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Cards Grid - Light Theme */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Muscle Group Card */}
                    <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="text-4xl mb-3">💪</div>
                            <h3 className="text-lg font-medium text-gray-500 mb-2">Primary Muscle</h3>
                            <p className="text-2xl font-bold text-gray-800">{exercise.muscleGroup}</p>
                        </div>
                    </div>

                    {/* Sets Card */}
                    <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="text-4xl mb-3">📊</div>
                            <h3 className="text-lg font-medium text-gray-500 mb-2">Recommended</h3>
                            <p className="text-2xl font-bold text-gray-800">{exercise.set}</p>
                        </div>
                    </div>

                    {/* Target Muscles Count Card */}
                    <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="text-4xl mb-3">🎯</div>
                            <h3 className="text-lg font-medium text-gray-500 mb-2">Target Muscles</h3>
                            <p className="text-2xl font-bold text-gray-800">{exercise.targetMuscle.length} muscles</p>
                        </div>
                    </div>
                </div>

                {/* Target Muscles Section - Light Theme */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="text-3xl">🎯</span>
                        Muscles Targeted
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {exercise.targetMuscle.map((muscle, index) => (
                            <div
                                key={index}
                                className="group relative"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className="relative px-6 py-3 bg-gray-100 text-gray-700 rounded-full text-sm font-medium inline-flex items-center gap-2 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    {muscle}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Execution Process Section - Light Theme */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-gray-200 shadow-xl mb-12">
                    <div className="flex items-start gap-6">
                        <div className="hidden lg:block">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                                📝
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-3xl">💡</span>
                                How to Perform
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {exercise.process}
                                </p>
                            </div>
                            
                            {/* Tips Section - Light Theme */}
                            <div className="mt-6 bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
                                <h3 className="text-yellow-700 font-medium mb-2 flex items-center gap-2">
                                    <span>💡</span>
                                    Pro Tip
                                </h3>
                                <p className="text-gray-600">
                                    Focus on controlled movements and proper form rather than speed. 
                                    Keep your core engaged throughout the exercise.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    );
}