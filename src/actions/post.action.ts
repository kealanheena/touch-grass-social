"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

interface PostCreationData {
	content: string,
	image: string,
}

export async function createPost(data: PostCreationData) {
	const { content, image } = data;

	try {
		const userId = await getDbUserId();

		const post = await prisma.post.create({
			data: {
				content,
				image,
				authorId: userId
			} 
		});

		revalidatePath('/');

		return { success: true, post };
	} catch (error) {
		console.error("Failed to create post: error", error) // purge the cache for the home page

		return { success: false, error: "Failed to create post" };
		
	}

	
		
}
