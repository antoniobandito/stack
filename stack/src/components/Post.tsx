import { addDoc, collection, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import React, { useState, useEffect } from 'react';
import '../styles/global.css';


interface PostProps {
  id: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: any;
  likes?: string[];
  reposts?: string[];
  mediaURL?: string;
}

const Post: React.FC<PostProps> = ({ id, authorId, authorUsername, content, createdAt, likes = [], reposts = [], mediaURL }) => {
  const user = auth.currentUser;
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasReposted, setHasReposted] = useState<boolean>(false);


  const handleLike = async () => {
    if (user) {
      const postRef = doc(db, 'posts', id);
      if (hasLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.email),
        });
        setHasLiked(false);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.email),
        });
        setHasLiked(true);
      }
    }
  };

  const handleRepost = async () => {
    if (user) {
      const postRef = doc(db, 'posts', id);
      if (!hasReposted) {
        await updateDoc(postRef, {
          reposts: arrayUnion(user.email),
        });
      await addDoc(collection(db, 'posts'), {
        content: `∞ ${authorUsername} reposted: ${content}`,
        authorId: user.uid,
        authorUsername: user.displayName || 'Unknown',
        createdAt: new Date(),
        likes: [],
        reposts: [],
      });
        setHasReposted(true);
      }
    } 
  };

  const handleDelete = async () => {
    if (user && user.uid === authorId) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  const postDate = createdAt?.seconds ? new Date(createdAt.seconds * 1000) : createdAt;

  return (
    <div className="border p-1 bg-white">
    <div className="font-sans text-m">{authorUsername || 'Uknown'}</div>

    {mediaURL && (
      <img src={mediaURL} alt={content} className='w-full h-auto mb-2 rounded-lg' />
    )} 

    <div className='mt-1 py-2 text-black text-lg'>{content}</div>

      {postDate ? (
        <div className="text-xs text-gray-600">{postDate.toLocaleString()}</div>
      ) : (
        <div className="text-sm text-gray-600">Invalid Date</div>
      )}

      <div className='flex space-x-2 mt-1'>
      <button 
      onClick={handleLike}
      className={`py-1 px-2 rounded ${hasLiked ? 'text-black' : ' text-black'}`}
      >
        {hasLiked ? '♡' : '♡'} {likes.length}
      </button>

      <button 
      onClick={handleRepost} 
      className={`py-1 px-2 rounded ${hasReposted ? 'text-black' : ' text-black'}`}
      >
        {hasReposted ? '∞︎︎' : '∞︎︎'} {reposts.length}
      </button>

      {user && user.uid === authorId && (
        <button 
        onClick={handleDelete}
        className='py-2 px-4 bg-white text-black '
        >
        ×
        </button>
      )}
    </div>
  </div>
  );
};

export default Post;
