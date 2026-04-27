import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getExercisesByFilter } from '@/APIs/exerciseAPIs'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

function capitalizeWord(s: string) {
    if (!s) return ""
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

// Types
interface Exercise {
    _id: string
    name: string
    slug: string
    imageUrl: string[]
    muscleGroup?: string
    difficulty?: string
}

interface ExerciseCardProps {
    exercise: Exercise
}

// Compact Exercise Card
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Image Container - Fixed height for consistency */}
        <div className="relative h-72 w-full overflow-hidden bg-gray-100">
            {exercise.imageUrl && exercise.imageUrl.length > 0 ? (
                <Image
                    src={exercise.imageUrl[0]}
                    alt={exercise.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                </div>
            )}
            
            {/* Difficulty badge — overlay on image */}
            <span className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md shadow-lg">
                {exercise.difficulty ? capitalizeWord(exercise.difficulty) : "—"}
            </span>
        </div>

        {/* Content */}
        <div className="p-4">
            {/* Title and Category */}
            <div className="mb-3">
                <Link 
                    href={`/workouts/${exercise.slug}`}
                    className="hover:text-blue-600 transition-colors"
                >
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {exercise.name}
                    </h3>
                </Link>
                <span className="text-sm text-gray-500">
                    {exercise.muscleGroup
                        ? capitalizeWord(exercise.muscleGroup)
                        : "—"}
                </span>
            </div>

            {/* Actions - Simplified */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Link
                    href={`/workouts/${exercise.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 group/link"
                >
                    View 
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
                
                <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors duration-200" title="Add to routine">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
)

const EmptyState: React.FC = () => (
    <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-lg">No exercises found for this category.</p>
    </div>
)

// Helper function to generate page numbers with ellipsis
const getPageNumbers = (currentPage: number, totalPages: number, maxVisible: number = 5) => {
    const pages = [];
    
    if (totalPages <= maxVisible) {
        // If total pages are less than max visible, show all pages
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always include first page
        pages.push(1);
        
        // Calculate start and end of visible pages around current page
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);
        
        // Adjust if we're near the start
        if (currentPage <= 3) {
            start = 2;
            end = Math.min(totalPages - 1, 4);
        }
        
        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
            start = Math.max(2, totalPages - 3);
            end = totalPages - 1;
        }
        
        // Add ellipsis after first page if needed
        if (start > 2) {
            pages.push('ellipsis-start');
        }
        
        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        // Add ellipsis before last page if needed
        if (end < totalPages - 1) {
            pages.push('ellipsis-end');
        }
        
        // Always include last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
    }
    
    return pages;
};

// Main Component
export default async function ExercisePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const currentPage = Math.max(
    1,
    parseInt(resolvedSearchParams?.page || "1", 10)
  );

  const itemsPerPage = Math.max(
    1,
    parseInt(resolvedSearchParams?.limit || "4", 10)
  );

  // ✅ Backend handles pagination
  const { exercises, totalCount } =
    await getExercisesByFilter({
      muscleGroup: "",
      difficulty: "",
      page: currentPage,
      limit: itemsPerPage,
    });

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / itemsPerPage)
  );

  const pageNumbers = getPageNumbers(
    currentPage,
    totalPages
  );

  return (
    <div className="min-h-screen bg-yellow-100/20 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Workouts
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {totalCount} exercise{totalCount !== 1 ? "s" : ""} • Page{" "}
            {currentPage} of {totalPages}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {exercises && exercises.length > 0 ? (
            exercises.map((exercise: Exercise) => (
              <ExerciseCard
                key={exercise._id}
                exercise={exercise}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>

                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${Math.max(
                      1,
                      currentPage - 1
                    )}&limit=${itemsPerPage}`}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis-start" ||
                    page === "ellipsis-end" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={`?page=${page}&limit=${itemsPerPage}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    href={`?page=${Math.min(
                      totalPages,
                      currentPage + 1
                    )}&limit=${itemsPerPage}`}
                    aria-disabled={
                      currentPage === totalPages
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        )}

      </div>
    </div>
  );
}