import { generateId, type User } from "lucia";
import {
	createPost,
	deletePost,
	getPostById,
	getPosts,
	getPostsByUserId,
	updatePost,
} from "@/data-access/posts";
import { AuthenticationError, UnauthorizedError } from "./errors";
import type { Pagination } from "./pagination";

export const isPostVisibleToUserUseCase = async (
	post: {
		status: "draft" | "published";
		userId: string;
	},
	userId: string,
) => {
	if (post.status === "draft" && post.userId !== userId) {
		return false;
	}

	return true;
};

export const getPostsUseCase = async ({
	user,
	pagination,
}: {
	user: User;
	pagination: Pagination;
}) => {
	const posts = await getPosts(pagination);

	return posts;
};

export const getPostByIdUseCase = async ({
	userId,
	postId,
}: {
	userId: string;
	postId: string;
}) => {
	const post = await getPostById(postId);

	if (!post) {
		throw new Error("Post not found");
	}

	if (!isPostVisibleToUserUseCase(post, userId)) {
		throw new AuthenticationError();
	}

	return post;
};

export const createPostUseCase = async ({
	userId,
	newPost,
}: {
	userId: string;
	newPost: {
		title: string;
		excerpt: string;
		content: string;
		status: "draft" | "published";
	};
}) => {
	//TODO: check if user has reached the limit of posts

	const postId = generateId(15);

	await createPost({
		id: postId,
		userId: userId,
		title: newPost.title,
		excerpt: newPost.excerpt,
		content: newPost.content,
		status: newPost.status,
	});
};

export const getPostsByUserUseCase = async (userId: string) => {
	const posts = await getPostsByUserId(userId);

	return posts;
};

export const updatePostUseCase = async ({
	postId,
	userId,
	updatedPost,
}: {
	postId: string;
	userId: string;
	updatedPost: {
		title: string;
		excerpt: string;
		content: string;
		status: "draft" | "published";
	};
}) => {
	const post = await getPostById(postId);

	if (!post) {
		throw new Error("Post not found");
	}

	if (post.userId !== userId) {
		throw new UnauthorizedError();
	}

	return await updatePost(postId, {
		title: updatedPost.title,
		excerpt: updatedPost.excerpt,
		content: updatedPost.content,
		status: updatedPost.status,
	});
};

export const deletePostUseCase = async ({
	postId,
	userId,
}: {
	postId: string;
	userId: string;
}) => {
	const post = await getPostById(postId);

	if (!post) {
		throw new Error("Post not found");
	}

	if (post.userId !== userId) {
		throw new UnauthorizedError();
	}

	await deletePost(postId);
};

export const publishPostUseCase = async ({
	postId,
	userId,
}: {
	postId: string;
	userId: string;
}) => {
	const post = await getPostById(postId);

	if (!post) {
		throw new Error("Post not found");
	}

	if (post.userId !== userId) {
		throw new UnauthorizedError();
	}

	await updatePost(postId, {
		status: "published",
	});
};
