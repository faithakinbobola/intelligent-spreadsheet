"use client"
import { User } from "@/types"
import { useState } from "react";

export default function UserList({ users }: { users: User[] }) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {users?.map((u) => (
                <div key={u.id} className="border rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-800">
                    <div 
                        className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedUserId === u.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                        onClick={() => setSelectedUserId(selectedUserId === u.id ? null : u.id)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                                {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{u.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Member since {new Date(u.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                    u.role === "ADMIN" 
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                }`}>
                                    {u.role}
                                </span>
                            </div>
                            <svg 
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${selectedUserId === u.id ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    
                    {selectedUserId === u.id && (
                        <div className="px-6 py-8 border-t bg-gray-50/50 dark:bg-gray-900/50">
                            {u.role === "ADMIN" ? (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">Admin accounts have full system access. No engagement tracking is applied to admin roles.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Engagements</p>
                                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                            {u.engagementCount}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">Posts Completed</p>
                                    </div>
                                    
                                    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Active</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Associate Role</p>
                                    </div>

                                    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Last Activity</p>
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                            {u.engagementCount && u.engagementCount > 0 ? "Recently Active" : "No Activity"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">Syncing in real-time</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
