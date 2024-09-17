import React from "react";
import { notFound, redirect } from "next/navigation";
import { PostEditor } from "./_components/post-editor";
import { ArrowLeftIcon } from "@/components/icons";
import Link from "next/link";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { getPostByIdAction } from "../../dashboard/posts/actions";

interface Props {
	params: {
		postId: string;
	};
}

export default async function EditPostPage({ params }: Props) {
	const { user } = await validateRequest();
	if (!user) redirect(Paths.Login);

	const post = await getPostByIdAction({ id: params.postId });
	if (!post?.data) notFound();

	if (post.data.user.id !== user.id) notFound();

	return (
		<main className="container min-h-[calc(100vh-120px)] pt-3 md:max-w-screen-md">
			<Link
				href="/dashboard/posts"
				className="mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:underline"
			>
				<ArrowLeftIcon className="h-5 w-5" /> back to posts
			</Link>

			<PostEditor post={post.data} />
		</main>
	);
}
