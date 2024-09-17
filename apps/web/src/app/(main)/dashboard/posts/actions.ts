"use server";

import { authActionClient } from "@/lib/safe-action";
import { paginationSchema } from "@/use-cases/pagination";
import {
	createPostUseCase,
	deletePostUseCase,
	getPostByIdUseCase,
	getPostsByUserUseCase,
	getPostsUseCase,
	publishPostUseCase,
	updatePostUseCase,
} from "@/use-cases/posts";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getPostsAction = authActionClient
	.schema(paginationSchema)
	.action(async ({ ctx, parsedInput }) => {
		const { page, perPage } = parsedInput;

		const posts = await getPostsUseCase({
			user: ctx.user,
			pagination: { page, perPage },
		});

		return posts;
	});

export const getPostsByUserAction = authActionClient.action(async ({ ctx }) => {
	const posts = await getPostsByUserUseCase(ctx.user.id);

	return posts;
});

export const getPostByIdAction = authActionClient
	.schema(
		z.object({
			id: z.string(),
		}),
	)
	.action(async ({ ctx, parsedInput }) => {
		const { id } = parsedInput;

		const post = await getPostByIdUseCase({
			userId: ctx.user.id,
			postId: id,
		});

		return post;
	});

export const createPostAction = authActionClient
	.schema(
		z.object({
			title: z.string(),
			excerpt: z.string(),
			content: z.string(),
			status: z.enum(["draft", "published"]),
		}),
	)
	.action(async ({ ctx, parsedInput }) => {
		const { title, excerpt, content, status } = parsedInput;

		await createPostUseCase({
			userId: ctx.user.id,
			newPost: {
				title,
				excerpt,
				content,
				status,
			},
		});

		revalidatePath("/dashboard/posts");
	});

export const updatePostAction = authActionClient
	.schema(
		z.object({
			id: z.string(),
			title: z.string().min(3).max(255).optional(),
			excerpt: z.string().min(3).max(255).optional(),
			content: z
				.string()
				.min(3)
				.max(
					1000,
					// "Content is too long, it should be less than 1000 characters",
				)
				.optional(),
			status: z.enum(["draft", "published"]).optional(),
		}),
	)
	.action(async ({ ctx, parsedInput }) => {
		const { id, title, excerpt, content, status } = parsedInput;

		await updatePostUseCase({
			postId: id,
			userId: ctx.user.id,
			updatedPost: {
				title,
				excerpt,
				content,
				status,
			},
		});

		revalidatePath("/dashboard/posts");
	});

export const deletePostAction = authActionClient
	.schema(z.string())
	.action(async ({ ctx, parsedInput }) => {
		await deletePostUseCase({
			postId: parsedInput,
			userId: ctx.user.id,
		});

		revalidatePath("/dashboard/posts");
	});

export const publishPostAction = authActionClient
	.schema(z.string())
	.action(async ({ ctx, parsedInput }) => {
		await publishPostUseCase({
			postId: parsedInput,
			userId: ctx.user.id,
		});

		revalidatePath("/dashboard/posts");
	});
