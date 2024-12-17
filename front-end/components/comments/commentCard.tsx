import React from 'react';
import Link from 'next/link';
import { Comment } from '@/types/index';

type Props = {
    comment: Comment;
}

const CommentCard = ({ comment }: Props) => {
  return (
    <div className="bg-text1 rounded-lg p-4 my-2">
      <div className="flex justify-between items-baseline mb-2">
        <Link 
          href={`/profile/${comment.author.id}`} 
          className="text-bg2 hover:text-text2 hover:scale-105 duration-100 main-font"
        >
          {comment.author.username ?? 'Unknown'}
        </Link>
        {comment.createdAt && (
          <span className="text-xs text-text2 main-thin">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <p className="text-text2 main-thin text-sm">
        {comment.body}
      </p>
    </div>
  );
};

export default CommentCard;
