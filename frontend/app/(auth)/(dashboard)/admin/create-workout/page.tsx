// app/exercises/new/page.tsx
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Link as LinkIcon, Youtube, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/APIs/cloudinary';
import Image from 'next/image';
import { createExercise, getExerciseBySlug, updateExercise } from '@/APIs/exerciseAPIs';

type ExerciseFormData = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string[];
  videoUrl?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  set: string;
  targetMuscle?: string[];
  process: string;
  muscleGroup: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core';
};

export default function NewExercisePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const editExerciseId = searchParams.get('id');
  const editExerciseSlug = searchParams.get('slug');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [targetMuscles, setTargetMuscles] = useState<string[]>([]);
  const [newTargetMuscle, setNewTargetMuscle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [activeImageTab, setActiveImageTab] = useState<'upload' | 'url'>('upload');
  const [isLoadingExercise, setIsLoadingExercise] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseFormData['difficulty']>('beginner');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<ExerciseFormData['muscleGroup']>('chest');

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<ExerciseFormData>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      difficulty: 'beginner',
      muscleGroup: 'chest',
      set: '',
      process: '',
      imageUrl: [],
      videoUrl: [],
      targetMuscle: [],
    },
  });

  useEffect(() => {
    if (!isEditMode || !editExerciseSlug) return;

    const loadExercise = async () => {
      try {
        setIsLoadingExercise(true);
        const response = await getExerciseBySlug(editExerciseSlug);
        const exercise = response?.data;
        if (!exercise) {
          toast.error('Exercise not found');
          return;
        }

        setValue('name', exercise.name ?? '');
        setValue('slug', exercise.slug ?? '');
        setValue('description', exercise.description ?? '');
        setValue('set', exercise.set ?? '');
        setValue('process', exercise.process ?? '');

        const difficulty = (exercise.difficulty ?? 'beginner') as ExerciseFormData['difficulty'];
        const muscleGroup = (exercise.muscleGroup ?? 'chest') as ExerciseFormData['muscleGroup'];
        setValue('difficulty', difficulty);
        setValue('muscleGroup', muscleGroup);
        setSelectedDifficulty(difficulty);
        setSelectedMuscleGroup(muscleGroup);

        const images = Array.isArray(exercise.imageUrl) ? exercise.imageUrl : [];
        const videos = Array.isArray(exercise.videoUrl) ? exercise.videoUrl : [];
        const muscles = Array.isArray(exercise.targetMuscle) ? exercise.targetMuscle : [];
        setValue('imageUrl', images);
        setValue('videoUrl', videos);
        setValue('targetMuscle', muscles);
        setUploadedImages(images);
        setVideoUrls(videos);
        setTargetMuscles(muscles);
      } catch {
        toast.error('Failed to load exercise details');
      } finally {
        setIsLoadingExercise(false);
      }
    };

    loadExercise();
  }, [editExerciseSlug, isEditMode, setValue]);

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

  // Handle image file upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // Handle direct image URL addition
  const handleAddImageUrl = (url: string) => {
    if (!url) return;
    
    try {
      new URL(url); // Validate URL
      const currentImages = getValues('imageUrl') || [];
      const newImages = [...currentImages, url];
      setValue('imageUrl', newImages);
      setUploadedImages(newImages);
      
      toast.success('Image URL added successfully');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  // Handle video URL addition
  const handleAddVideoUrl = () => {
    if (!newVideoUrl) return;
    
    try {
      new URL(newVideoUrl); // Validate URL
      
      // Optional: Validate if it's a YouTube URL
      const isYouTube = newVideoUrl.includes('youtube.com') || newVideoUrl.includes('youtu.be');
      
      const currentVideos = getValues('videoUrl') || [];
      const newVideos = [...currentVideos, newVideoUrl];
      setValue('videoUrl', newVideos);
      setVideoUrls(newVideos);
      setNewVideoUrl('');
      
      toast.success(isYouTube ? 'YouTube URL added successfully' : 'Video URL added successfully');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  // Handle target muscle addition
  const handleAddTargetMuscle = () => {
    if (!newTargetMuscle.trim()) return;
    
    const currentMuscles = getValues('targetMuscle') || [];
    const updatedMuscles = [...currentMuscles, newTargetMuscle.trim()];
    setValue('targetMuscle', updatedMuscles);
    setTargetMuscles(updatedMuscles);
    setNewTargetMuscle('');
  };

  // Remove image
  const removeImage = (index: number) => {
    const currentImages = getValues('imageUrl') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue('imageUrl', newImages);
    setUploadedImages(newImages);
  };

  // Remove video
  const removeVideo = (index: number) => {
    const currentVideos = getValues('videoUrl') || [];
    const newVideos = currentVideos.filter((_, i) => i !== index);
    setValue('videoUrl', newVideos);
    setVideoUrls(newVideos);
  };

  // Remove target muscle
  const removeTargetMuscle = (index: number) => {
    const currentMuscles = getValues('targetMuscle') || [];
    const newMuscles = currentMuscles.filter((_, i) => i !== index);
    setValue('targetMuscle', newMuscles);
    setTargetMuscles(newMuscles);
  };

  // Extract YouTube video ID for thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/0.jpg` : null;
  };

  // Submit form
  const onSubmit = async (data: ExerciseFormData) => {
    try {
      if (isEditMode && editExerciseId) {
        await updateExercise(editExerciseId, data);
        toast.success('Exercise updated successfully');
      } else {
        await createExercise(data);
        toast.success('Exercise created successfully');
      }
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch {
      toast.error(isEditMode ? 'Failed to update exercise' : 'Failed to create exercise');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isEditMode ? 'Edit Exercise' : 'Create New Exercise'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update exercise details, media, and instructions.'
              : 'Add a new exercise with images, videos, and detailed instructions.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingExercise && (
            <p className="mb-4 text-sm text-gray-500">Loading exercise details...</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Exercise Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  onChange={handleNameChange}
                  placeholder="e.g., Barbell Bench Press"
                  required
                />
              </div>

              {/* Slug Field */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="barbell-bench-press"
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of the exercise..."
                rows={3}
              />
            </div>

            {/* Difficulty and Muscle Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty Field */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={(value: ExerciseFormData['difficulty']) => {
                    setSelectedDifficulty(value);
                    setValue('difficulty', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Muscle Group Field */}
              <div className="space-y-2">
                <Label htmlFor="muscleGroup">Primary Muscle Group *</Label>
                <Select
                  value={selectedMuscleGroup}
                  onValueChange={(value: ExerciseFormData['muscleGroup']) => {
                    setSelectedMuscleGroup(value);
                    setValue('muscleGroup', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chest">Chest</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                    <SelectItem value="legs">Legs</SelectItem>
                    <SelectItem value="arms">Arms</SelectItem>
                    <SelectItem value="shoulders">Shoulders</SelectItem>
                    <SelectItem value="core">Core</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sets and Target Muscles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sets Field */}
              <div className="space-y-2">
                <Label htmlFor="set">Sets/Reps Recommendation *</Label>
                <Input
                  id="set"
                  {...register('set')}
                  placeholder="e.g., 3 sets of 8-12 reps"
                  required
                />
              </div>

              {/* Target Muscles */}
              <div className="space-y-2">
                <Label>Target Muscles</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTargetMuscle}
                    onChange={(e) => setNewTargetMuscle(e.target.value)}
                    placeholder="e.g., Pectoralis Major"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTargetMuscle();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTargetMuscle} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Target Muscles Tags */}
                {targetMuscles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {targetMuscles.map((muscle, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {muscle}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTargetMuscle(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Process/Instructions Field */}
            <div className="space-y-2">
              <Label htmlFor="process">Exercise Instructions *</Label>
              <Textarea
                id="process"
                {...register('process')}
                placeholder="Step by step instructions on how to perform the exercise..."
                rows={6}
                required
              />
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <Label>Exercise Images</Label>
              
              <Tabs value={activeImageTab} onValueChange={(v: any) => setActiveImageTab(v)}>
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
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
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
                          handleAddImageUrl((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('image-url') as HTMLInputElement;
                        handleAddImageUrl(input.value);
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative rounded-lg overflow-hidden border">
                        <Image
                          src={url}
                          alt={`Exercise image ${index + 1}`}
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
            </div>

            {/* Videos Section */}
            <div className="space-y-4">
              <Label>Exercise Videos (YouTube URLs)</Label>
              
              <div className="flex gap-2">
                <Input
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="Enter YouTube video URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddVideoUrl();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddVideoUrl}>
                  <Youtube className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>

              {/* Video Previews */}
              {videoUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {videoUrls.map((url, index) => {
                    const thumbnailUrl = getYouTubeThumbnail(url);
                    
                    return (
                      <div key={index} className="relative group border rounded-lg overflow-hidden">
                        <div className="aspect-video relative bg-gray-100">
                          {thumbnailUrl ? (
                            <Image
                              src={thumbnailUrl}
                              alt={`Video thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Youtube className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Watch Video
                            </a>
                          </div>
                        </div>
                        <div className="p-2 flex justify-between items-center bg-gray-50">
                          <p className="text-xs truncate flex-1">{url}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeVideo(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isUploading || (isEditMode && isLoadingExercise)}
                className="w-full"
              >
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Exercise' : 'Create Exercise')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}