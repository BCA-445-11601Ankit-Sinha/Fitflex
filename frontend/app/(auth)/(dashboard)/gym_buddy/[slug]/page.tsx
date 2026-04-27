import React from 'react'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/APIs/productAPIs'
import ProductImageCarousel from '@/components/ProductImageCarousel'
import ProductActions from '@/components/ProductActions'
import AdminProductEditAction from '@/components/AdminProductEditAction'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

const Page = async ({ params }: PageProps) => {
  // Await the params to get the slug
  const { slug } = await params
  
  // Fetch product data
  const response = await getProductBySlug(slug)
  
  // Extract product from response
  const product = response?.product

  // If product not found, show 404
  if (!product) {
    notFound()
  }

  // Format price to Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Image Carousel Section - Using Client Component */}
          <ProductImageCarousel 
            images={product.imageUrl} 
            productName={product.name} 
          />

          {/* Product Info */}
          <div className="flex flex-col space-y-6 lg:space-y-8">
            {/* Product Type */}
            <div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                {product.type}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.price + Math.round(product.price * 0.3))}
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-full">
                30% off
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <ProductActions productId={product._id} />
            <AdminProductEditAction productId={product._id} slug={product.slug} />

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">7 Days Return</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Fast Delivery</span>
              </div>
            </div>

            {/* Created/Updated info */}
            <div className="text-xs text-gray-400 pt-4">
              Added on {new Date(product.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page