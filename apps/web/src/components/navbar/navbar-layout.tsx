import { Navbar } from "./navbar";
import type { User } from "lucia";
import { APP_TITLE } from "@/lib/constants";
import { VerificiationWarning } from "@/app/(main)/_components/verificiation-warning";
import { NavbarBreadcrumb } from "./navbar-breadcrumb";

export function NavbarLayout({
	user,
	children,
}: { user: User; children: React.ReactNode }) {
	return (
		<>
			<Navbar user={user} title={APP_TITLE} />

			<main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
				<div className="relative">
					<VerificiationWarning user={user} />
				</div>

				<div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
			</main>
		</>
	);
}
