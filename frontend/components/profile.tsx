"use client"
import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

const Profile = () => {
    const router = useRouter()
    const { user } = useAuthStore()

    const handleClick = () => {
        router.push('/profile')
    }

    return (
        <div 
            onClick={handleClick} 
            className="flex items-center gap-3 cursor-pointer group"
        >
            {/* Avatar with subtle hover effect */}
            <div className="relative">
                {user?.photoURL ? (
                    <img 
                        src={user.photoURL} 
                        alt={user.name || 'Profile'} 
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-300"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm group-hover:shadow-md transition-all duration-300">
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                )}
            </div>

            {/* Name with subtle hover effect */}
            <p className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                {user?.name?.split(' ')[0] || 'Guest'}
            </p>
        </div>
    )
}

export default Profile