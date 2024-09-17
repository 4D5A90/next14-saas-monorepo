import type { ReactNode } from "react";
import { SidebarLayout } from "@/components/sidebar/sidebar-layout";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";
import { VerificiationWarning } from "./_components/verificiation-warning";
import { Navbar } from "@/components/navbar/navbar";
import { NavbarLayout } from "@/components/navbar/navbar-layout";

const MainLayout = async ({ children }: { children: ReactNode }) => {
	const { user } = await validateRequest();

	if (!user) redirect(Paths.Login);

	return <SidebarLayout user={user}>{children}</SidebarLayout>;
	//return <NavbarLayout user={user}>{children}</NavbarLayout>;
};

export default MainLayout;
