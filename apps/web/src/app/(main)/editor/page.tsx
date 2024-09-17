import { validateRequest } from "@/lib/auth/validate-request";
import { getPostsByUserAction } from "../dashboard/posts/actions";
import { NewPost } from "../dashboard/_components/new-post";
import { PostCard } from "../dashboard/_components/post-card";
import { redirect } from "next/navigation";
import { Paths } from "@/lib/constants";

export default async function PostsPage() {
	const { user } = await validateRequest();
	if (!user) redirect(Paths.Login);

	const posts = await getPostsByUserAction(user);

	return (
		<div className="mb-6 flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold md:text-4xl">Posts</h1>
				<p className="text-sm text-muted-foreground">Manage your posts here</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<NewPost />
				{posts?.data
					? posts.data.map((post) => (
							<PostCard key={post.id} post={post} user={user} />
						))
					: "No posts"}
			</div>
		</div>
	);
}
