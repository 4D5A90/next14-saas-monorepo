"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostPreview } from "./post-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil2Icon } from "@/components/icons";
import { LoadingButton } from "@/components/loading-button";
import Link from "next/link";
import { createPostSchema } from "@/server/api/routers/post/post.input";
import {
	publishPostAction,
	updatePostAction,
} from "../../../dashboard/posts/actions";
import { useAction } from "next-safe-action/hooks";
import { showSuccess } from "@/components/toast-success";
import { showErrors } from "@/components/toast-error";
import { parseActionErrors } from "@/lib/hooks/use-form-action-result";
import type { Post } from "@/server/db/schema";
import { Badge, BadgeCheckIcon } from "lucide-react";
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

const markdownlink = "https://remarkjs.github.io/react-markdown/";

export const PostEditor = ({ post }: { post: Post }) => {
	if (!post) return null;

	const formRef = useRef<HTMLFormElement>(null);

	const form = useForm({
		defaultValues: {
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
		},
		resolver: zodResolver(createPostSchema),
	});

	const { execute, isExecuting } = useAction(updatePostAction, {
		onSuccess: () => showSuccess("Post updated successfully"),
		onError: ({ error }) => {
			const errors = parseActionErrors({ error }, "Failed to update post");
			showErrors(errors);
		},
	});

	const { execute: publishPost, isExecuting: isPublishing } = useAction(
		publishPostAction,
		{
			onSuccess: () => showSuccess("Post published successfully"),
			onError: ({ error }) => {
				const errors = parseActionErrors({ error }, "Failed to publish post");
				showErrors(errors);
			},
		},
	);

	const onSubmit = form.handleSubmit(async (values) => {
		execute({ ...values, id: post.id });
	});

	return (
		<>
			<div className="flex items-center gap-2 justify-between">
				<div className="flex items-center gap-2">
					<Pencil2Icon className="h-5 w-5" />
					<h1 className="text-2xl font-bold">{post.title}</h1>
				</div>

				<div className="flex items-center gap-4">
					{post.status === "draft" ? (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<LoadingButton
									loading={isPublishing}
									className="ml-auto"
									variant="outline"
								>
									Publish
								</LoadingButton>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										Once you publish your post, it will be visible to everyone.
										Make sure everything is correct. If you need to edit it, you
										can always come back to this page.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={() => publishPost(post.id)}>
										Yes, publish it!
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					) : (
						<div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200">
							<BadgeCheckIcon className="h-4 w-4" /> Published
						</div>
					)}

					<LoadingButton
						disabled={!form.formState.isDirty}
						loading={isExecuting}
						onClick={() => formRef.current?.requestSubmit()}
						className="ml-auto"
					>
						Save
					</LoadingButton>
				</div>
			</div>
			<div className="h-6" />
			<Form {...form}>
				<form
					ref={formRef}
					onSubmit={onSubmit}
					className="block max-w-screen-md space-y-4"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Post Title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="excerpt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Excerpt</FormLabel>
								<FormControl>
									<Textarea {...field} rows={2} className="min-h-0" />
								</FormControl>
								<FormDescription>
									A short description of your post
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<Tabs defaultValue="code">
								<TabsList>
									<TabsTrigger value="code">Code</TabsTrigger>
									<TabsTrigger value="preview">Preview</TabsTrigger>
								</TabsList>
								<TabsContent value="code">
									<FormItem>
										<FormControl>
											<Textarea {...field} className="min-h-[200px]" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</TabsContent>
								<TabsContent value="preview" className="space-y-2">
									<div className="prose prose-sm min-h-[200px] max-w-[none] rounded-lg border px-3 py-2 dark:prose-invert">
										<PostPreview text={form.watch("content") || post.content} />
									</div>
								</TabsContent>
								<Link href={markdownlink}>
									<span className="text-[0.8rem] text-muted-foreground underline underline-offset-4">
										Supports markdown
									</span>
								</Link>
							</Tabs>
						)}
					/>
				</form>
			</Form>
		</>
	);
};
