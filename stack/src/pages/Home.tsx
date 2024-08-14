import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Post from '../components/Post';
import FloatingActionButton from '../components/FloatingActionButton';
import '../styles/global.css';

interface PostData {
  id: string;
  content: string;
  authorId: string;
  authorUsername: string;
  likes?: string[];
  reposts?: string[];
  mediaURL?: string;
  createdAt: any;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: PostData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PostData[];
      setPosts(postsData);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className='max-w-4xl mx-auto grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {posts.map(post => (
        <div key={post.id} className='w-full h-full overflow-hidden rounded-lg shadow-lg'>
      <Post
        key={post.id}
        id={post.id}
        authorId={post.authorId}
        authorUsername={post.authorUsername}
        content={post.content}
        createdAt={post.createdAt}
        likes={post.likes}
        reposts={post.reposts}
        mediaURL={post.mediaURL}
      />
      </div>
      ))}
    </div>
    <FloatingActionButton />
  </div>
  );
};

export default Home;
