import React, { useState } from 'react';

type Props ={
  onSubmit: (comment: string) => void;
}

const CommentInput: React.FC<Props> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e)=>{
      e.preventDefault();
      onSubmit(comment);
      setComment('');
  }

  return (
    <div className="bg-text1 rounded-lg p-4 shadow-sm">
      <form className="flex items-center space-x-3">
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 w-full p-2 bg-bg4 text-text2 rounded-md focus:outline-none resize-none main-thin text-md"
          maxLength={255}
        />
        <button 
            type='button'
            onClick={(e)=>handleSubmit(e)}
            className="bg-bg4 text-text2 px-4 py-2 rounded-md hover:bg-text2 hover:text-bg1 transition duration-200 main-font uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={comment.trim() === ''}
        >
          Comment
        </button>
      </form>
    </div>
  );
};

export default CommentInput;
