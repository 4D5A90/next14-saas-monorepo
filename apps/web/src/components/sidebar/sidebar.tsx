"use client";

import Link from "next/link";
import { PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "zustand";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/sidebar/sidebar-menu";
import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";

export function Sidebar({ title }: { title?: string }) {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	return (
		<aside
			className={cn(
				"fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
				sidebar.isOpen ? "w-72" : "w-[80px]",
			)}
		>
			<SidebarToggle isOpen={sidebar.isOpen} setIsOpen={sidebar.setIsOpen} />
			<div className="relative h-full flex flex-col px-2 pb-4 pt-[6px] overflow-y-auto shadow-md dark:shadow-zinc-800">
				<Button
					className={cn(
						"transition-transform ease-in-out duration-300 mb-1",
						sidebar.isOpen ? "translate-x-0" : "translate-x-1",
					)}
					variant="link"
					asChild
				>
					<Link href="/dashboard" className="flex items-center gap-4">
						<PanelsTopLeft className="w-6 h-6 mr-1" />
						<h1
							className={cn(
								"font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
								sidebar.isOpen
									? "translate-x-0 opacity-100"
									: "-translate-x-96 opacity-0 hidden",
							)}
						>
							{title ?? "Brand"}
						</h1>
					</Link>
				</Button>
				<Menu isOpen={sidebar?.isOpen} />
			</div>
		</aside>
	);
}
