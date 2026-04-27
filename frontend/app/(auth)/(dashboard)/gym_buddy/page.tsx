import { getAllProducts } from "@/APIs/productAPIs";
import Link from "next/link";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string[];
  type: string;
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) => {
  const { page, limit } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const itemsPerPage = Math.max(1, Number(limit) || 12);

  const { products, totalCount } = await getAllProducts({
    page: currentPage,
    limit: itemsPerPage,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / itemsPerPage)
  );

  // ✅ Smart pagination window (max 5 buttons shown)
  const paginationWindow = 2;
  const startPage = Math.max(
    1,
    currentPage - paginationWindow
  );
  const endPage = Math.min(
    totalPages,
    currentPage + paginationWindow
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 py-12">
        {products.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <Link
                  key={product._id}
                  href={`/gym_buddy/${product.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border"
                >
                  <div className="relative w-full h-72 bg-gray-100">
                    {product.imageUrl?.[0] && (
                      <Image
                        src={product.imageUrl[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <span className="text-xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
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

                    {/* First Page */}
                    {startPage > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          href={`?page=1&limit=${itemsPerPage}`}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Page Window */}
                    {Array.from(
                      { length: endPage - startPage + 1 },
                      (_, i) => startPage + i
                    ).map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href={`?page=${pageNumber}&limit=${itemsPerPage}`}
                          isActive={
                            currentPage === pageNumber
                          }
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Last Page */}
                    {endPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          href={`?page=${totalPages}&limit=${itemsPerPage}`}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

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
          </>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-sm font-medium">
              No products found
            </h3>
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;