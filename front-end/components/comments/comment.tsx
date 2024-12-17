import React from 'react';
import Link from 'next/link';

interface Props {
    comment: Comment;
}

const Comment = ({ comment }: Props) => {
  return (
    <div className="bg-bg2 rounded-lg p-4 my-2">
      <div className="flex justify-between items-baseline mb-2">
        <Link 
          href={`/profile/${comm}`} 
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

export default Comment;
