"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export const BreadcrumbNav = ({ segments }: { segments: string[] }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.map((segment, index) => {
					const isSeparator = index !== segments.length - 1 && index !== 0;
					const breadcrumbLink = segments.slice(0, index + 1).join("/");

					return (
						<Fragment key={segment}>
							<BreadcrumbItem>
								{index === segments.length - 1 ? (
									<BreadcrumbPage className="capitalize">
										{segment}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={breadcrumbLink} className="capitalize">
										{segment}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{isSeparator && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
