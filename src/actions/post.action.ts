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

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, // recipient (post author)
                  creatorId: userId, // person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}
