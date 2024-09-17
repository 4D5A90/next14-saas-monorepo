"use client";

import Link from "next/link";
import { Package2 } from "lucide-react";
import type { User } from "lucia";
import { UserDropdown } from "../user-dropdown";
import { usePathname } from "next/navigation";
import { getMenuList } from "../sidebar/sidebar-menu";
import { cn } from "@/lib/utils";
import { SheetMenu } from "../sidebar/sheet-menu";
import { ModeToggle } from "../mode-toggle";

export function Navbar({ title, user }: { title: string; user: User }) {
	const pathname = usePathname();
	const menuList = getMenuList(pathname);

	return (
		<header className="sticky z-10 top-0 flex h-14 items-center gap-4 border-b px-2 md:px-6 bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
			<nav className="hidden flex-col gap-6 text-lg font-medium sm:flex sm:flex-row sm:items-center sm:gap-5 sm:text-sm lg:gap-6">
				<Link
					href="#"
					className="flex items-center gap-2 text-lg font-semibold sm:text-base"
				>
					<Package2 className="h-6 w-6" />
					<span className="sr-only">{title}</span>
				</Link>

				{menuList.map(({ menus }, index) =>
					menus.map(({ href, label }, index) => (
						<Link
							key={href}
							href={href}
							className={cn(
								"transition-colors hover:text-foreground",
								pathname === href
									? "text-foreground"
									: "text-muted-foreground ",
							)}
						>
							{label}
						</Link>
					)),
				)}
			</nav>
			<SheetMenu className="sm:hidden" />
			<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
				<ModeToggle />
				<UserDropdown email={user.email} />
			</div>
		</header>
	);
}
