"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { FilePlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { set } from "zod";
import { createPostAction } from "../posts/actions";

export const NewPost = () => {
	const [isCreatePending, startCreateTransaction] = React.useTransition();
	const [isModalOpen, setModalOpen] = React.useState(false);

	const createPost = () => {
		// if (!isEligible) {
		// 	toast.message("You've reached the limit of posts for your current plan", {
		// 		description: "Upgrade to create more posts",
		// 	});
		// 	return;
		// }

		startCreateTransaction(async () => {
			createPostAction({
				title: "Untitled Post",
				content: "Write your content here",
				excerpt: "untitled post",
				status: "draft",
			});
		});
	};

	return (
		<React.Fragment>
			<AlertDialog open={isModalOpen} onOpenChange={setModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>New Post</AlertDialogTitle>
						<AlertDialogDescription>
							Would you like to edit newly created post?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>No</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								// router.push(`/editor/${post.data?.id}`);
							}}
						>
							Yes
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Button
				onClick={createPost}
				className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
				disabled={isCreatePending}
			>
				<div className="flex flex-col items-center gap-4">
					<FilePlusIcon className="h-10 w-10" />
					<p className="text-sm">New Post</p>
				</div>
			</Button>
		</React.Fragment>
	);
};
