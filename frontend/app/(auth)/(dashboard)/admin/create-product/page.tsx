'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { toast } from "sonner";

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadToCloudinary } from '@/APIs/cloudinary';
import { createProduct, getProductBySlug, updateProduct } from '@/APIs/productAPIs';

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  price: number;
  type: 'suppliments' | 'utility' | 'apparel';
  imageUrl?: string[] | undefined;
};

export default function NewProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const editProductId = searchParams.get('id');
  const editProductSlug = searchParams.get('slug');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [directImageUrls, setDirectImageUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      imageUrl: [],
      type: 'suppliments',
    },
  });

  // Populate form when editing an existing product.
  useEffect(() => {
    if (!isEditMode || !editProductSlug) return;

    const loadProduct = async () => {
      try {
        setIsLoadingProduct(true);
        const response = await getProductBySlug(editProductSlug);
        const product = response?.product;
        if (!product) {
          toast.error('Product not found');
          return;
        }

        setValue('name', product.name ?? '');
        setValue('slug', product.slug ?? '');
        setValue('description', product.description ?? '');
        setValue('price', Number(product.price ?? 0));
        setValue('type', (product.type ?? 'suppliments') as ProductFormData['type']);

        const images = Array.isArray(product.imageUrl) ? product.imageUrl : [];
        setValue('imageUrl', images);
        setUploadedImages(images);
        setDirectImageUrls(images);
      } catch {
        toast.error('Failed to load product details');
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [editProductSlug, isEditMode, setValue]);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      const currentImages = getValues('imageUrl') || [];
      const newImages = [...currentImages, ...uploadedUrls];
      setValue('imageUrl', newImages);
      setUploadedImages(newImages);
      
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle direct URL addition
  const handleAddUrl = (url: string) => {
    if (!url) return;
    
    try {
      new URL(url); // Validate URL
      const currentImages = getValues('imageUrl') || [];
      const newImages = [...currentImages, url];
      setValue('imageUrl', newImages);
      setDirectImageUrls([...directImageUrls, url]);
      
      toast.success('URL added successfully');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const currentImages = getValues('imageUrl') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue('imageUrl', newImages);
    setUploadedImages(newImages);
    setDirectImageUrls(newImages);
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    setValue('slug', generateSlug(name));
  };

  // Submit form
  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        ...data,
        imageUrl: data.imageUrl || [],
      };

      if (isEditMode && editProductId) {
        await updateProduct(editProductId, payload);
        toast.success('Product updated successfully');
      } else {
        await createProduct(payload);
        toast.success('Product created successfully');
      }

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch {
      toast.error(isEditMode ? 'Failed to update product' : 'Failed to create product');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isEditMode ? 'Edit Product' : 'Create New Product'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the product details below. You can upload images or provide direct image URLs.'
              : 'Fill in the product details below. You can upload images or provide direct image URLs.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProduct && (
            <p className="mb-4 text-sm text-gray-500">Loading product details...</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register('name')}
                onChange={handleNameChange}
                placeholder="Enter product name"
              />
            </div>

            {/* Slug Field */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="product-url-slug"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter product description"
                rows={5}
              />
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            {/* Type Field */}
            <div className="space-y-2">
              <Label htmlFor="type">Product Type</Label>
              <Select
                onValueChange={(value: any) => setValue('type', value)}
                defaultValue="suppliments"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suppliments">Supplements</SelectItem>
                  <SelectItem value="utility">Utility</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Product Images</Label>
              
              <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Direct URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </span>
                    </Label>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter image URL"
                      id="image-url"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUrl((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('image-url') as HTMLInputElement;
                        handleAddUrl(input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </TabsContent>
                
                
              </Tabs>

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative rounded-lg overflow-hidden border">
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Image URLs List */}
              {directImageUrls.length > 0 && (
                <div className="mt-4">
                  <Label className="mb-2 block">Added Image URLs</Label>
                  <ul className="space-y-2">
                    {directImageUrls.map((url, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 ml-2 hover:bg-red-100"
                          onClick={() => {
                            const newUrls = directImageUrls.filter((_, i) => i !== index);
                            setDirectImageUrls(newUrls);
                            const currentImages = getValues('imageUrl') || [];
                            const newImages = currentImages.filter(img => img !== url);
                            setValue('imageUrl', newImages);
                          }}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              
              <Button
                type="submit"
                disabled={isSubmitting || isUploading || (isEditMode && isLoadingProduct)}
                className="w-full"
              >
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}