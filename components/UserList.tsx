"use client"
import { User } from "@/types"
import { useState, useMemo } from "react";

type FilterType = "all" | "active_associate" | "inactive_associate" | "admin" | "associate";
type SortOrder = "asc" | "desc" | null;

export default function UserList({ users }: { users: User[] }) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [showEngagements, setShowEngagements] = useState<string | null>(null);
    
    // Filter/Search/Sort State
    const [filter, setFilter] = useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);

    const filteredAndSortedUsers = useMemo(() => {
        let result = [...users];

        // Search by Name
        if (searchQuery) {
            result = result.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Filter by Status/Role
        if (filter !== "all") {
            result = result.filter(u => {
                if (filter === "admin") return u.role === "ADMIN";
                if (filter === "associate") return u.role === "ASSOCIATE";
                if (filter === "active_associate") return u.role === "ASSOCIATE" && u.engagementCount > 0;
                if (filter === "inactive_associate") return u.role === "ASSOCIATE" && u.engagementCount === 0;
                return true;
            });
        }

        // Sort by Name
        if (sortOrder) {
            result.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (sortOrder === "asc") return nameA.localeCompare(nameB);
                return nameB.localeCompare(nameA);
            });
        }

        return result;
    }, [users, filter, searchQuery, sortOrder]);

    const activeFilterLabel = {
        all: "All Users",
        active_associate: "Active Associates",
        inactive_associate: "Inactive Associates",
        admin: "Admins",
        associate: "All Associates"
    }[filter];

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                isFilterOpen || filter !== "all" 
                                ? "bg-blue-600 text-white border-transparent shadow-md" 
                                : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-100 dark:border-zinc-800 hover:border-blue-400"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {activeFilterLabel}
                        </button>

                        {isFilterOpen && (
                            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {(["all", "admin", "associate", "active_associate", "inactive_associate"] as FilterType[]).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${filter === f ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-zinc-500'}`}
                                    >
                                        {f.replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            sortOrder 
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-md" 
                            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-100 dark:border-zinc-800 hover:border-blue-400"
                        }`}
                    >
                        <svg className={`w-4 h-4 transition-transform duration-300 ${sortOrder === "desc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        Sort Name {sortOrder === "asc" ? "(A-Z)" : sortOrder === "desc" ? "(Z-A)" : ""}
                    </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className={`flex items-center bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl px-3 transition-all duration-300 overflow-hidden ${isSearchOpen ? 'w-full sm:w-64 opacity-100 ring-2 ring-blue-500/20' : 'w-10 sm:w-10 opacity-60'}`}>
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <input 
                            type="text" 
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`bg-transparent border-none text-xs font-medium focus:ring-0 w-full placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-gray-900 dark:text-white transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 ml-2' : 'opacity-0 w-0 pointer-events-none'}`}
                        />
                        {isSearchOpen && searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="text-gray-300 hover:text-gray-500 p-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* User Grid */}
            <div className="space-y-3">
                {filteredAndSortedUsers.length > 0 ? (
                    filteredAndSortedUsers.map((u) => (
                        <div key={u.id} className="border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
                            <div 
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${selectedUserId === u.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                onClick={() => {
                                    setSelectedUserId(selectedUserId === u.id ? null : u.id);
                                    setShowEngagements(null);
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        {u.role === "ASSOCIATE" && (<div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-zinc-900 rounded-full ${u.engagementCount > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{u.name}</h3>
                                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                                            u.role === "ADMIN" 
                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" 
                                            : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                        }`}>
                                            {u.role}
                                        </span>
                                    </div>
                                    {u.role === "ASSOCIATE" && (<div className="flex flex-col items-end min-w-20">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{u.engagementCount}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Actions</span>
                                    </div>)}
                                    <svg 
                                        className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${selectedUserId === u.id ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {selectedUserId === u.id && (
                                <div className="px-6 py-8 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30">
                                    {u.role === "ADMIN" ? (
                                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                                            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div className="max-w-xs">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Full Administrative Access</p>
                                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Admin accounts have full system access. Engagement tracking is only applied to associate roles.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowEngagements(showEngagements === u.id ? null : u.id);
                                                    }}
                                                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center group ${
                                                        showEngagements === u.id 
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                                                        : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-blue-400"
                                                    }`}
                                                >
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${showEngagements === u.id ? "text-blue-100" : "text-gray-400 dark:text-zinc-500"}`}>Engagements</p>
                                                    <p className={`text-4xl font-black ${showEngagements === u.id ? "text-white" : "text-blue-600 dark:text-blue-400"}`}>
                                                        {u.engagementCount}
                                                    </p>
                                                    <p className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${showEngagements === u.id ? "text-blue-100" : "text-gray-400 group-hover:text-blue-500"}`}>
                                                        {showEngagements === u.id ? "Hide details" : "View details"}
                                                    </p>
                                                </button>
                                                
                                                <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center">
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Status</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${u.engagementCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{u.engagementCount > 0 ? 'Active' : 'Inactive'}</p>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-tighter">Syncing Real-time</p>
                                                </div>

                                                <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center">
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Last Active</p>
                                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {u.engagementCount && u.engagementCount > 0 ? "Recently" : "Never"}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-tighter">
                                                        {u.lastActivity ? new Date(u.lastActivity).toLocaleDateString() : "No Activity"}
                                                    </p>
                                                </div>
                                            </div>

                                            {showEngagements === u.id && u.engagements && (
                                                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                                                    <div className="px-5 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Engagement History</h4>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            {u.engagements.length} Items
                                                        </span>
                                                    </div>
                                                    <div className="divide-y divide-gray-50 dark:divide-zinc-800 max-h-64 overflow-y-auto custom-scrollbar">
                                                        {u.engagements.length > 0 ? (
                                                            u.engagements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((eng, idx) => (
                                                                <div key={idx} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                                            {u.engagements.length - idx}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{eng.post_title}</p>
                                                                            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium uppercase mt-0.5">Interaction Recorded</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                                            {new Date(eng.created_at).toLocaleDateString()}
                                                                        </p>
                                                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-medium">
                                                                            {new Date(eng.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-5 py-10 text-center">
                                                                <p className="text-sm text-gray-400 italic">No engagements recorded yet.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50/50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
                        <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg className="w-8 h-8 text-gray-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15.21 17.033a6.002 6.002 0 00-11.21 0M11 20H3m15 20h3" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">No users found</h4>
                        <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1 max-w-xs mx-auto">Try adjusting your filters or search query to find the users you're looking for.</p>
                        <button 
                            onClick={() => { setFilter("all"); setSearchQuery(""); setSortOrder(null); }}
                            className="mt-6 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
