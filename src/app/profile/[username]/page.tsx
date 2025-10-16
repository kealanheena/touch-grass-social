import { getProfileByUsername, isFollowing } from "@/actions/profile.action";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ProfilePageClient from "./ProfilePageClient";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata | undefined> {
	const user: User = await getProfileByUsername(params.username);

	if (!user) {
		return;
	}

	return {
		title: `Profile | ${user.name || params.username}`,
		description: user.bio || `Checkout out ${params.username}'s profile!`,
	}
}

async function ProfilePageServer({ params }: { params: { username: string } }) {
	const user = await getProfileByUsername(params.username)

	if (!user) {
		notFound();
	}

	const isCurrentUserFollowing = await isFollowing(user.id);

	return (
		<ProfilePageClient
			user={user}
			isFollowing={isCurrentUserFollowing}
		/>
	)
}

export default ProfilePageServer;