"use client";

import { Pencil2Icon, TrashIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { getPostsByUserUseCase } from "@/use-cases/posts";
import { showSuccess } from "@/components/toast-success";
import { showErrors } from "@/components/toast-error";
import { useAction } from "next-safe-action/hooks";
import { deletePostAction } from "../posts/actions";
import { Fragment, useState } from "react";
import { parseActionErrors } from "@/lib/hooks/use-form-action-result";
import type { User } from "lucia";

interface PostCardProps {
	post: Awaited<ReturnType<typeof getPostsByUserUseCase>>[number];
	user: User;
}

export const PostCard = ({ post, user }: PostCardProps) => {
	const router = useRouter();

	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { execute: deletePost, isExecuting } = useAction(deletePostAction, {
		onSuccess: () => {
			showSuccess("Post deleted");
			router.refresh();
		},
		onError: ({ error }) => {
			const errors = parseActionErrors({ error }, "Failed to delete post");
			showErrors(errors);
		},
	});

	return (
		<Fragment>
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							post and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => deletePost(post.id)}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Card>
				<CardHeader>
					<CardTitle className="line-clamp-2 text-base">{post.title}</CardTitle>
					<CardDescription className="line-clamp-1 text-sm whitespace-pre">
						{post.user.username ? (
							<span className="font-bold text-primary">
								{post.user.username}
							</span>
						) : null}
						{" at "}
						{new Date(post.createdAt).toLocaleString(undefined, {
							dateStyle: "medium",
							timeStyle: "short",
						})}
					</CardDescription>
				</CardHeader>
				<CardContent className="line-clamp-3 text-sm">
					{post.excerpt}
				</CardContent>
				<CardFooter className="flex-row-reverse gap-2">
					{user.id === post.user.id && (
						<>
							<Button variant="secondary" size="sm" asChild>
								<Link href={`/dashboard/posts/editor/${post.id}`}>
									<Pencil2Icon className="mr-1 h-4 w-4" />
									<span>Edit</span>
								</Link>
							</Button>
							<Button
								variant="secondary"
								size="icon"
								className="h-8 w-8 text-destructive"
								onClick={() => setDeleteDialogOpen(true)}
								disabled={isExecuting}
							>
								<TrashIcon className="h-5 w-5" />
								<span className="sr-only">Delete</span>
							</Button>
						</>
					)}
					<Badge variant="outline" className="mr-auto rounded-lg capitalize">
						{post.status} Post
					</Badge>
				</CardFooter>
			</Card>
		</Fragment>
	);
};
