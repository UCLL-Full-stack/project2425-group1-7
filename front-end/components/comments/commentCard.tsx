import React from 'react';
import Link from 'next/link';
import { Comment } from '@/types/index';
import IconDelete from '../ui/delete';

type Props = {
    comment: Comment;
    onDelete?: (id:number)=>void;
}

const CommentCard = ({ comment, onDelete }: Props) => {
  return (
        <div className="bg-text1 rounded-lg p-4 my-2 relative">
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
            <div className="flex "> 
                <p className="text-text2 main-thin text-sm break-all w-full pr-8">
                    {comment.body}
                </p>
                {onDelete && (
                    <IconDelete 
                        className="text-bg2 hover:text-red-500 hover:scale-105 duration-100 absolute right-4 top-1/2"
                        onClick={() => onDelete(comment.id)}
                        width={30} 
                        height={30}
                    />
                )}
            </div>
        </div>  
  );
};

export default CommentCard;
