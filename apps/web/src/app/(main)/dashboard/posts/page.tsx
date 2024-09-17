import { validateRequest } from "@/lib/auth/validate-request";
import { getPostsAction, getPostsByUserAction } from "./actions";
import { NewPost } from "../_components/new-post";
import { PostCard } from "../_components/post-card";

import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function PostsPage() {
	const { user } = await validateRequest();
	if (!user) redirect(Paths.Login);

	const posts = await getPostsAction({});

	return (
		<div className="mb-6 flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold md:text-4xl">Posts</h1>
				<p className="text-sm text-muted-foreground">All posts here</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{posts?.data
					? posts.data.map((post) => (
							<PostCard key={post.id} post={post} user={user} />
						))
					: "No posts"}
			</div>
		</div>
	);
}
