import { useState } from 'react'
import { AdminNavbar } from './AdminNavbar'
import { AdminSidebar } from './AdminSidebar'
import { ThemeProvider } from '@/components/theme-provider'

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="min-h-screen font-sans antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-zinc-950 dark:from-zinc-950 dark:to-zinc-950 text-slate-900 dark:text-zinc-100">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="lg:pl-64">
                    <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    )
}
