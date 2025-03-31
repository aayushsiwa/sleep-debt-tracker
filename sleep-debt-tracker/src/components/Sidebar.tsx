import { CircleUserRound, EllipsisVertical } from "lucide-react";

interface SidebarProps {
    userId: string;
}

function Sidebar({ userId }: SidebarProps) {
    return (
        <aside className="w-64 bg-gray-800 p-6 rounded-lg">
            <nav className="mt-6 space-y-2">
                <div className="flex gap-4 items-center py-2">
                    <CircleUserRound />
                    {userId}
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition"
                    >
                        <EllipsisVertical />
                    </a>
                </div>
                <a
                    href="#"
                    className="block py-2 text-gray-400 hover:text-white transition"
                >
                    Overview
                </a>
                <a
                    href="#"
                    className="block py-2 text-gray-400 hover:text-white transition"
                >
                    Sleep Logs
                </a>
            </nav>
        </aside>
    );
}

export default Sidebar;
