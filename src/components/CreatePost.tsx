"use client"

import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'

import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ImageIcon, Loader2Icon, SendIcon } from 'lucide-react';
import { createPost } from '@/actions/post.action';
import toast from 'react-hot-toast';

function CreatePost() {
	const { user } = useUser();

	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [isPosting, setIsPosting] = useState(false);
	const [showImageUpload, setShowImageUpload] = useState(false);

	const handleSubmit = async () => {
		if (!content.trim() && !imageUrl) {
			return;
		}

		setIsPosting(true);

		try {
			const { success } = await createPost({ content, image: imageUrl })

			if (success) {
				setContent("")
				setImageUrl("")
				setShowImageUpload(false)
			}

			toast.success('Post created successfully! 😊')
		} catch (error) {
			console.error('Failed to create post: ', error)
			toast.success('Failed to create post 😢')
		} finally {
			setIsPosting(false);
		}
	};
	const onChangeContent = (e) => setContent(e.target.value);

	const onClickShowImageUpload = () => setShowImageUpload(!showImageUpload);

	return (
		<Card className='mb-6'>
			<CardContent className='pt-6'>
				<div className='space-y-4'>
					<div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={onChangeContent}
              disabled={isPosting}
            />
          </div>

					{/* TODO: Handle image uploads */}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={onClickShowImageUpload}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default CreatePost