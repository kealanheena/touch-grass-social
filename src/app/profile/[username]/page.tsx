
function ProfilePage({ params }: { params: { username: string } }) {
	console.log({ params });

	return (
		<div>
			Profile Page
		</div>
	)
}

export default ProfilePage;