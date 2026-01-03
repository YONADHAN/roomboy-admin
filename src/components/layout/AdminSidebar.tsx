import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    MapPin,
    Settings,
    Building,
    Users,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Locations', href: '/locations', icon: MapPin },
    { name: 'Field Definitions', href: '/field-definitions', icon: Settings },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Business Contacts', href: '/business-contacts', icon: Users },
]

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation()

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-64 border-r transition-transform duration-300 lg:translate-x-0",
                    "bg-gradient-to-b from-white to-blue-50 border-slate-200 text-slate-700", // Light theme
                    "dark:bg-zinc-900/95 dark:from-zinc-900 dark:to-zinc-900 dark:border-zinc-800 dark:text-zinc-400", // Dark theme
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between border-b px-6 dark:border-zinc-800 border-slate-100">
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-neutral-100">Room Admin</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="py-4">
                    <nav className="space-y-1 px-3">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.href ||
                                (item.href !== '/' && location.pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={onClose} // Close sidebar on mobile nav
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                        "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100", // Hover states
                                        isActive
                                            ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm dark:bg-blue-500/10 dark:from-transparent dark:to-transparent dark:text-blue-400 dark:shadow-none"
                                            : "text-slate-600 dark:text-zinc-400"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-zinc-500")} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </aside>
        </>
    )
}
