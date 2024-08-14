import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
          setName(docSnap.data().name);
          setBio(docSnap.data().bio);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, 'profiles', user.uid);
      await updateDoc(docRef, { name, bio });
      setEditing(false);
      setProfile((prev: any) => ({ ...prev, name, bio }));
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      {editing ? (
        <div>
          <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder='Name'
          className='border p-2 rounded mb-2 w-full'
          />
          <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder='Bio'
          className='border p-2 rounded mb-2 w-full'
          />
          <button onClick={handleSave} className='bg-blue-50 text-white px-4 py-2 rounded'>Save</button>
        </div>
      ) : (
        <div>
          <h1 className='text-2xl font-bold'>{profile.name}</h1>
          <button onClick={() => setEditing(true)} className='mt-2 bg-blue-50 text-white px-4 py-2 rounded'>Edit</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
