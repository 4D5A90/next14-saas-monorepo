"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbNav } from "../breadcrumb-nav";

export const NavbarBreadcrumb = () => {
	const pathname = usePathname();
	return (
		<div className="fixed flex p-2 justify-start border-b border-zinc-200 dark:border-zinc-800 w-full shadow backdrop-blur">
			<BreadcrumbNav segments={pathname.split("/")} />
		</div>
	);
};
