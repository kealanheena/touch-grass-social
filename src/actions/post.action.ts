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

		if (!userId) {
			return;
		}

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

export async function getPosts() {
	try {
		const posts = await prisma.post.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				author: {
					select: {
						name: true,
						image: true,
						username: true
					}
				},
				comments: {
					orderBy: {
						createdAt: 'asc'
					},
					include: {
						author: {
							select: {
								id: true,
								name: true,
								image: true,
								username: true
							}
						}
					}
				},
				likes: {
					select: {
						userId: true,
					}
				},
				_count: {
					select: {
						likes: true,
						comments: true,
					}
				}
			}
		});

		return posts;
	} catch (error) {
		console.error('Error in getPosts', error);

		throw new Error('Failed to fetch posts')
	}
}
