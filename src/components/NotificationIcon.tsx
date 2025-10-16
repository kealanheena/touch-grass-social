"use client"

import React from 'react';
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";

function NotificationIcon({ type }: { type: string | null }) {
	if (type === 'LIKE') {
		return <HeartIcon className="size-4 text-red-500" />;
	}

	if (type === 'COMMENT') {
		return <MessageCircleIcon className="size-4 text-blue-500" />;
	}

	if (type === 'FOLLOW') {
		return <UserPlusIcon className="size-4 text-green-500" />;
	}

	return null;
}

export default NotificationIcon;