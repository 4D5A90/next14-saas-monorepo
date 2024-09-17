import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/sidebar/sidebar-menu";
import {
	Sheet,
	SheetHeader,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SheetMenu({
	className,
	title,
}: { className?: string; title?: string }) {
	return (
		<Sheet>
			<SheetTrigger className={cn("lg:hidden", className)} asChild>
				<Button className="h-8" variant="outline" size="icon">
					<MenuIcon size={20} />
				</Button>
			</SheetTrigger>
			<SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
				<SheetHeader>
					<Button
						className="flex justify-center items-center pb-2 pt-1"
						variant="link"
						asChild
					>
						<Link href="/dashboard" className="flex items-center gap-2">
							<PanelsTopLeft className="w-6 h-6 mr-1" />
							<h1 className="font-bold text-lg">{title ?? "Brand"}</h1>
						</Link>
					</Button>
				</SheetHeader>
				<Menu isOpen />
			</SheetContent>
		</Sheet>
	);
}
