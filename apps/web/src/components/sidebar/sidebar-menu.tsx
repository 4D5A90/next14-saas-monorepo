"use client";

import Link from "next/link";
import {
	Tag,
	Users,
	Settings,
	Bookmark,
	SquarePen,
	LayoutGrid,
	Ellipsis,
	LogOut,
	type LucideIcon,
	DollarSign,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/sidebar/collapse-menu-button";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from "@/components/ui/tooltip";

interface MenuProps {
	isOpen: boolean | undefined;
}

export type Submenu = {
	href: string;
	label: string;
	// active: boolean;
};

export type Menu = {
	href: string;
	label: string;
	// active: boolean;
	icon: LucideIcon;
	submenus: Submenu[];
};

export type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: "",
			menus: [
				{
					href: "/dashboard",
					label: "Dashboard",
					icon: LayoutGrid,
					submenus: [],
				},
			],
		},
		{
			groupLabel: "Contents",
			menus: [
				{
					href: "/dashboard/posts",
					label: "Posts",
					icon: SquarePen,
					submenus: [
						{
							href: "/dashboard/posts",
							label: "All Posts",
						},
						{
							href: "/dashboard/posts/editor",
							label: "My Posts",
						},
					],
				},
			],
		},
		{
			groupLabel: "Settings",
			menus: [
				{
					href: "/dashboard/billing",
					label: "Billing",
					icon: DollarSign,
					submenus: [],
				},
				{
					href: "/dashboard/settings",
					label: "Account",
					icon: Settings,
					submenus: [],
				},
			],
		},
	];
}

export function Menu({ isOpen }: MenuProps) {
	const pathname = usePathname();
	const menuList = getMenuList(pathname);

	return (
		<ScrollArea className="[&>div>div[style]]:!block">
			<nav className="mt-8 h-full w-full">
				<ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
					{menuList.map(({ groupLabel, menus }) => (
						<li
							className={cn("w-full", groupLabel ? "pt-5" : "")}
							key={groupLabel}
						>
							{(isOpen && groupLabel) || isOpen === undefined ? (
								<p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
									{groupLabel}
								</p>
							) : !isOpen && isOpen !== undefined && groupLabel ? (
								<TooltipProvider>
									<Tooltip delayDuration={100}>
										<TooltipTrigger className="w-full">
											<div className="w-full flex justify-center items-center">
												<Ellipsis className="h-5 w-5" />
											</div>
										</TooltipTrigger>
										<TooltipContent side="right">
											<p>{groupLabel}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : (
								<p className="pb-2" />
							)}

							{menus.map(({ href, label, icon: Icon, submenus }) =>
								submenus.length === 0 ? (
									<div className="w-full" key={href}>
										<TooltipProvider disableHoverableContent>
											<Tooltip delayDuration={100}>
												<TooltipTrigger asChild>
													<Button
														variant={pathname === href ? "secondary" : "ghost"}
														className={cn(
															"w-full h-10 mb-1",
															isOpen && "justify-start",
														)}
														asChild
													>
														<Link href={href}>
															<span className={cn(isOpen && "mr-4")}>
																<Icon size={18} />
															</span>
															<p
																className={cn(
																	"max-w-[200px] truncate",
																	isOpen === false
																		? "-translate-x-96 hidden w-0"
																		: "translate-x-0 opacity-100",
																)}
															>
																{label}
															</p>
														</Link>
													</Button>
												</TooltipTrigger>
												{isOpen === false && (
													<TooltipContent side="right">{label}</TooltipContent>
												)}
											</Tooltip>
										</TooltipProvider>
									</div>
								) : (
									<div className="w-full" key={href}>
										<CollapseMenuButton
											icon={Icon}
											label={label}
											active={pathname === href}
											submenus={submenus}
											isOpen={isOpen}
										/>
									</div>
								),
							)}
						</li>
					))}
					<li className="w-full grow flex items-end">
						<TooltipProvider disableHoverableContent>
							<Tooltip delayDuration={100}>
								<TooltipTrigger asChild>
									<Button
										onClick={() => {}}
										variant="outline"
										className="w-full justify-center h-10 mt-5"
									>
										<span className={cn(isOpen === false ? "" : "mr-4")}>
											<LogOut size={18} />
										</span>
										<p
											className={cn(
												"whitespace-nowrap",
												isOpen === false ? "opacity-0 hidden" : "opacity-100",
											)}
										>
											Sign out
										</p>
									</Button>
								</TooltipTrigger>
								{isOpen === false && (
									<TooltipContent side="right">Sign out</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>
					</li>
				</ul>
			</nav>
		</ScrollArea>
	);
}
