import { getProfileByUsername } from "@/actions/profile.action";

export async function generateMetadata({ params }: { params: { username: string } }) {
	const user = getProfileByUsername(params.username)

	if (!user) {
		return;
	}

	return {
		title: `Profile | ${user.name || params.username}`,
		description: user.bio || `Checkout out ${params.username}'s profile!`,
	}
}

function ProfilePage({ params }: { params: { username: string } }) {
	console.log({ params });

	return (
		<div>
			Profile Page
		</div>
	)
}

export default ProfilePage;