"use client";

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

import { getPosts } from '@/actions/post.action';

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]

function PostCard({ post, dbUserId } : { post: Post, dbUserId: string | null }) {
	const { user } = useUser();
	const [newComment, setNewComment] = useState('');
	const [isCommenting, setIsCommenting] = useState(false);
	const [isLiking, setIsLiking] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [hasLiked, setHasLiked] = useState(post.likes.some(like => {
		like.userId === dbUserId
	}));
	const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

	const onClickLike = async () => {
		if (isLiking) {
			return;
		}

		try {
			setIsLiking(true);
			setHasLiked(prev => !prev);
			setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1));

			await toggleLike(post.id);
		} catch (error) {
			setOptimisticLikes(post._count.likes);
			setHasLiked(post.likes.some(like => {
				like.userId === dbUserId
			}));
		} finally {
			setIsLiking(false);
		}
	};

	const onClickComment = async () => {};

	const onClickDeletePost = async () => {};

	return (
		<div>PostCard</div>
	)
}

export default PostCard;