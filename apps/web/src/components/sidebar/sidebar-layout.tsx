"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { useStore } from "zustand";
import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle";
import { SheetMenu } from "@/components/sidebar/sheet-menu";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { UserDropdown } from "@/components/user-dropdown";
import type { User } from "lucia";
import { APP_TITLE } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../mode-toggle";
import { VerificiationWarning } from "@/app/(main)/_components/verificiation-warning";

export const SidebarLayout = ({
	user,
	children,
}: { user: User; children: React.ReactNode }) => {
	const pathname = usePathname();
	const sidebar = useStore(useSidebarToggle, (state) => state);

	return (
		<>
			<Sidebar title={APP_TITLE} />
			<main
				className={cn(
					"min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
					sidebar.isOpen ? "lg:ml-72" : "lg:ml-[80px]",
				)}
			>
				<header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
					<div className="mx-4 sm:mx-8 flex h-12 items-center">
						<div className="flex items-center space-x-4 lg:space-x-0">
							<SheetMenu title={APP_TITLE} />
							<BreadcrumbNav segments={pathname.split("/")} />
						</div>

						<div className="flex flex-1 items-center space-x-2 justify-end">
							<ModeToggle />
							<UserDropdown email={user.email} />
						</div>
					</div>
				</header>
				<div className="relative">
					<VerificiationWarning user={user} />
				</div>
				<div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
			</main>
		</>
	);
};
