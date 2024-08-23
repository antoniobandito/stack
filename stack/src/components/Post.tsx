import { addDoc, collection, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
  fileURL?: string;
}

const Post: React.FC<PostProps> = ({ 
  id, 
  authorId, 
  authorUsername, 
  content, 
  createdAt, 
  likes = [], 
  reposts = [], 
  mediaURL, 
  fileURL 
  }) => {
  const user = auth.currentUser;
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasReposted, setHasReposted] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setHasLiked(likes.includes(user.email!));
      setHasReposted(reposts.includes(user.email!));
  }
  }, [likes, reposts, user]);


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
    if (user && !hasReposted) {
      const postRef = doc(db, 'posts', id);
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

  const handleDelete = async () => {
    if (user && user.uid === authorId) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  return (
    <div className={`grid-item ${mediaURL ? 'media-post' : 'text-post'}`}>
    <div className="font-sans text-m">{authorUsername || 'Uknown'}</div>
    {content && <div className="text-black mb-2">{content}</div>}

    {mediaURL && (
      <div className="mt-1">
      <img 
      src={mediaURL} 
      alt="Uploaded media" 
      className="w-full h-auto object-cover max-h-60 rounded" 
      />
    </div>
    )}

    {fileURL && (
      <div className="mt-1">
        <a 
        href={fileURL} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-black">
        view attached file
        </a>
      </div>
    )}

      <div className='flex items-center mt-2'>
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
        className='py-1 px-3 bg-white text-black '
        >
        ×
        </button>
      )}
    </div>
  </div>
  );
};

export default Post;
