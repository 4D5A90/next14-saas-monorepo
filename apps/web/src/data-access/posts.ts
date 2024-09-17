import { db } from "@/server/db";
import { type NewPost, type Post, posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getPosts = async (input: {
	page?: number;
	perPage?: number;
}) => {
	// const page = input.page ?? 0;
	// const perPage = input.perPage ?? 0;

	// const offset = (page - 1) * perPage || undefined;
	// const limit = input?.perPage;

	return await db.query.posts.findMany({
		where: (table, { eq }) => eq(table.status, "published"),
		orderBy: (table, { desc }) => desc(table.createdAt),
		// offset,
		// limit,
		columns: {
			id: true,
			title: true,
			excerpt: true,
			status: true,
			createdAt: true,
		},
		with: { user: { columns: { id: true, username: true } } },
	});
};

export const getPostsByUserId = async (userId: string) => {
	return await db.query.posts.findMany({
		where: (table, { eq }) => eq(table.userId, userId),
		orderBy: (table, { desc }) => desc(table.createdAt),
		columns: {
			id: true,
			title: true,
			excerpt: true,
			status: true,
			createdAt: true,
		},
		with: { user: { columns: { id: true, username: true } } },
	});
};

export const getPostById = async (id: string) => {
	return await db.query.posts.findFirst({
		where: (table, { eq }) => eq(table.id, id),
		with: { user: { columns: { id: true, username: true } } },
	});
};

export const createPost = async (newPost: NewPost) => {
	return await db.insert(posts).values(newPost);
};

type UpdatedPost = Pick<Post, "title" | "excerpt" | "content" | "status">;

export const updatePost = async (
	postId: string,
	updatedPost: Partial<UpdatedPost>,
) => {
	return await db.update(posts).set(updatedPost).where(eq(posts.id, postId));
};

export const deletePost = async (postId: string) => {
	return await db.delete(posts).where(eq(posts.id, postId));
};
