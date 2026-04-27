// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, X, SlidersHorizontal, CornerDownLeft } from "lucide-react";
// import { searchExercises } from "@/APIs/exerciseAPIs";
// import { usePathname } from "next/navigation";
// import { searchProducts } from "@/APIs/productAPIs";

// export default function SearchBar() {
//   const [ExerciseData, setExerciseData] = useState([]);
//   const [ProductData, setProductData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const searchRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const pathname = usePathname()


//   const handleSearch = (query?: string) => {
//     const searchTerm = query || searchQuery;
//     if (searchTerm.trim()) {
//       if (pathname === "/workouts") {
//         searchExercises(searchTerm)
//           .then((results) => {
//             setExerciseData(results.data);
//           })
//           .catch((error) => {
//             console.error("Error searching exercises:", error);
//           });
//       } else if (pathname === "/gym_buddy") {
//         console.log("this is product route")
//         searchProducts(searchTerm)
//           .then((results) => {
//             setProductData(results.data);
//             console.log("data", results.data)
//           })
//           .catch((error) => {
//             console.error("Error searching products:", error);
//           });
//       }
//       setShowSuggestions(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//     inputRef.current?.focus();
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     setSearchQuery(suggestion);
//     handleSearch(suggestion);
//     setShowSuggestions(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSearch();
//     }
//   };

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//         setIsFocused(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Show suggestions when focused and there's no query
//   useEffect(() => {
//     if (isFocused && !searchQuery) {
//       setShowSuggestions(true);
//     } else if (searchQuery) {
//       setShowSuggestions(false);
//     }
//   }, [isFocused, searchQuery]);

//   let popularSearches = null;
//   if (pathname === "/workouts") {
//     popularSearches = ["Push ups", "Squats", "Planks", "Lunges", "Burpees"];
//   } else if (pathname === "/gym_buddy") {
//     popularSearches = ["Protein powder", "Creatine", "BCAA", "Pre-workout", "Vitamins"];
//   }

//   if(pathname !== "/gym_buddy" && pathname !== "/workouts"){
//     return null;
//   }

//   return (
//     <div className="w-full max-w-md mx-auto" ref={searchRef}>
//       <form 
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSearch();
//         }} 
//         className="relative"
//       >
//         <div className="relative">
//           {/* Search Icon */}
//           <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
//             isFocused ? "text-blue-500" : "text-gray-400"
//           }`} />
          
//           {/* Input Field */}
//           <Input
//             ref={inputRef}
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onFocus={() => {
//               setIsFocused(true);
//               if (!searchQuery) setShowSuggestions(true);
//             }}
//             onKeyDown={handleKeyDown}
//             placeholder="Search exercises, workouts..."
//             className="w-full pl-10 pr-20 py-5 text-sm rounded-full border-2 shadow-md 
//                      bg-white dark:bg-gray-900
//                      focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 
//                      transition-all duration-300"
//           />

//           {/* Action Buttons */}
//           <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//             {/* Clear Button - Only shows when there's text */}
//             {searchQuery && (
//               <button
//                 type="button"
//                 onClick={clearSearch}
//                 className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full
//                          transition-colors duration-200"
//                 aria-label="Clear search"
//               >
//                 <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
//               </button>
//             )}

            

//             {/* Enter Button - Visual indicator for Enter key */}
//             <button
//               type="submit"
//               className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full
//                        transition-colors duration-200 shadow-md hover:shadow-lg
//                        disabled:opacity-50 disabled:cursor-not-allowed"
//               aria-label="Search"
//               disabled={!searchQuery.trim()}
//             >
//               <CornerDownLeft className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Search Suggestions Dropdown */}
//         {showSuggestions && (
//           <div className="absolute top-full left-0 right-0 mt-2 
//                         bg-white dark:bg-gray-900 rounded-2xl border shadow-xl 
//                         z-50 animate-in fade-in slide-in-from-top-2 duration-200
//                         overflow-hidden">
//             <div className="p-3">
//               <p className="text-xs font-medium text-gray-500 px-3 py-2">
//                 Popular searches
//               </p>
//               <div className="space-y-1">
//                 {popularSearches?.map((suggestion) => (
//                   <button
//                     key={suggestion}
//                     onClick={() => handleSuggestionClick(suggestion)}
//                     className="w-full text-left px-3 py-2.5 text-sm 
//                              hover:bg-gray-100 dark:hover:bg-gray-800 
//                              rounded-xl transition-colors duration-200
//                              flex items-center gap-3 group"
//                   >
//                     <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
//                     <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
//                   </button>
//                 ))}
//               </div>

//             </div>
//           </div>
//         )}
//       </form>

      
//     </div>
//   );
// }




"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal, CornerDownLeft, Dumbbell, Package, Loader2 } from "lucide-react";
import { searchExercises } from "@/APIs/exerciseAPIs";
import { usePathname, useRouter } from "next/navigation";
import { searchProducts } from "@/APIs/productAPIs";
import Image from "next/image";
import Link from "next/link";

interface Exercise {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images?: { url: string }[];
  imageUrl?: string[];
}

export default function SearchBar() {
  const [exerciseData, setExerciseData] = useState<Exercise[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isWorkoutsPage = pathname === "/workouts";
  const isGymBuddyPage = pathname === "/gym_buddy";

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      setIsLoading(true);
      
      try {
        if (isWorkoutsPage) {
          const results = await searchExercises(searchTerm);
          setExerciseData(results.data || []);
          setProductData([]); // Clear product data when on workouts page
        } else if (isGymBuddyPage) {
          const results = await searchProducts(searchTerm);
          setProductData(results.data || []);
          setExerciseData([]); // Clear exercise data when on gym_buddy page
        }
      } catch (error) {
        console.error("Error searching:", error);
        setExerciseData([]);
        setProductData([]);
      } finally {
        setIsLoading(false);
        // Keep suggestions closed after search
        setShowSuggestions(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setExerciseData([]);
    setProductData([]);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show suggestions when focused and there's no query AND no search results
  useEffect(() => {
    if (isFocused && !searchQuery) {
      setShowSuggestions(true);
    } else if (searchQuery) {
      setShowSuggestions(false);
    }
  }, [isFocused, searchQuery]);

  // Don't render on other pages
  if (!isWorkoutsPage && !isGymBuddyPage) {
    return null;
  }

  const popularSearches = isWorkoutsPage 
    ? ["Push ups", "Squats", "Planks", "Lunges", "Burpees"]
    : ["Protein powder", "Creatine", "BCAA", "Pre-workout", "Vitamins"];

  const hasResults = isWorkoutsPage ? exerciseData.length > 0 : productData.length > 0;
  const results = isWorkoutsPage ? exerciseData : productData;

  // Get image URL helper function
  const getImageUrl = (item: Exercise | Product) => {
    if (isWorkoutsPage) {
      const exercise = item as Exercise;
      return exercise.imageUrl?.[0] || "/placeholder-exercise.jpg";
    } else {
      const product = item as Product;
      // Handle different possible image field names
      if (product.images && product.images.length > 0) {
        return product.images[0].url;
      }
      if (product.imageUrl && product.imageUrl.length > 0) {
        return product.imageUrl[0];
      }
      return "/placeholder-product.jpg";
    }
  };

  // Get navigation path
  const getItemPath = (item: Exercise | Product) => {
    if (isWorkoutsPage) {
      return `/workouts/${item.slug}`;
    } else {
      return `/gym_buddy/${item.slug}`;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" ref={searchRef}>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }} 
        className="relative"
      >
        <div className="relative">
          {/* Search Icon */}
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
            isFocused ? "text-blue-500" : "text-gray-400"
          }`} />
          
          {/* Input Field */}
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              // Only show suggestions if no search query
              if (!searchQuery) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={isWorkoutsPage ? "Search exercises..." : "Search supplements..."}
            className="w-full pl-10 pr-20 py-5 text-sm rounded-full border-2 shadow-md 
                     bg-white dark:bg-gray-900
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 
                     transition-all duration-300"
          />

          {/* Action Buttons */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full
                         transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full
                       transition-colors duration-200 shadow-md hover:shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Search"
              disabled={!searchQuery.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CornerDownLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Search Suggestions Dropdown - Shows when focused and no query */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 
                        bg-white dark:bg-gray-900 rounded-2xl border shadow-xl 
                        z-50 animate-in fade-in slide-in-from-top-2 duration-200
                        overflow-hidden">
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 px-3 py-2">
                Popular searches
              </p>
              <div className="space-y-1">
                {popularSearches.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2.5 text-sm 
                             hover:bg-gray-100 dark:hover:bg-gray-800 
                             rounded-xl transition-colors duration-200
                             flex items-center gap-3 group"
                  >
                    {isWorkoutsPage ? (
                      <Dumbbell className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results Dropdown - Shows after search */}
        {(exerciseData.length > 0 || productData.length > 0 || isLoading) && !showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 
                        bg-white dark:bg-gray-900 rounded-2xl border shadow-xl 
                        z-50 animate-in fade-in slide-in-from-top-2 duration-200
                        max-h-96 overflow-y-auto">
            <div className="p-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : hasResults ? (
                <>
                  <p className="text-xs font-medium text-gray-500 px-3 py-2">
                    {results.length} {results.length === 1 ? 'result' : 'results'} found
                  </p>
                  <div className="space-y-2">
                    {results.map((item) => (
                      <Link
                        key={item._id}
                        href={getItemPath(item)}
                        onClick={() => {
                          // Clear results when navigating
                          setExerciseData([]);
                          setProductData([]);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 px-3 py-2.5
                                 hover:bg-gray-100 dark:hover:bg-gray-800 
                                 rounded-xl transition-colors duration-200 group"
                      >
                        {/* Image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img
                            src={getImageUrl(item)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = isWorkoutsPage 
                                ? "/placeholder-exercise.jpg" 
                                : "/placeholder-product.jpg";
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {item.name}
                          </h4>
                          {!isWorkoutsPage && (
                            <p className="text-sm text-blue-600 font-semibold">
                              ₹{(item as Product).price?.toLocaleString()}
                            </p>
                          )}
                        </div>

                        {/* View indicator */}
                        <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                          View →
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}