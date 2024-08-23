import React, { useState } from 'react';
import { auth, db, storage } from '../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { FaImage, FaFile } from 'react-icons/fa';
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import '../styles/global.css';

interface CreatePostModalProps {
    onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const { user } = useAuth();

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileURL = URL.createObjectURL(file);
            if (e.target.id === 'upload-media') {
                setMediaFile(file);
                setMediaPreview(fileURL);
            } else if (e.target.id === 'upload-file') {
                setUploadFile(file);
            }
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !mediaFile && !uploadFile) {
            setError('Post cannot be empty.');
            return;

        }

        try {
            let mediaURL = '';
            let fileURL = '';

            // Upload media file if exists
            if (mediaFile) {
                console.log("uploading media file:", mediaFile);
                const mediaRef = ref(storage, `media/${uuidv4()}-${mediaFile.name}`);
                await uploadBytes(mediaRef, mediaFile);
                mediaURL = await getDownloadURL(mediaRef);
                console.log("Media file uploaded, URL:", mediaURL);
            }

            // Upload other file if exists
            if (uploadFile) {
                console.log("Uploading other file:", uploadFile);
                const fileRef = ref(storage, `files/${uuidv4()}-${uploadFile.name}`);
                await uploadBytes(fileRef, uploadFile);
                fileURL = await getDownloadURL(fileRef);
                console.log("Other file uploaded, URL:", fileURL);
            }

            // Create post in Firestor
            await addDoc(collection(db, 'posts'), {
                content,
                author: user?.uid,
                authorUsername: user?.displayName || 'Unknown',
                createdAt: Timestamp.now(),
                mediaURL,
                fileURL,
                likes:[],
                reposts: [],
            });

            setContent('');
            setMediaFile(null);
            setUploadFile(null);
            setMediaPreview(null);
            setError('');
            onClose();
        } catch (err) {
            console.error("Failed to create post:", err);
            setError("Failed to create post");
        }
     
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Post</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="relative">
                    <label htmlFor="content" className="block text-sm font-medium text-black"></label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Share something..."
                        className="mt-1 block w-full p-2 border rounded"
                    />
                    {mediaPreview && (
                        <div className="mt-2">
                            <img src={mediaPreview} alt="Selected media" className="media-preview rounded" />
                        </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex space-x-2 text-black">
                        <label htmlFor="upload-media" className="cursor-pointer">
                            <FaImage size={20} />
                            <input
                                id="upload-media"
                                type="file"
                                accept="image/*,video/*,image/gif"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <label htmlFor="upload-file" className="cursor-pointer">
                            <FaFile size={20} />
                            <input
                                id="upload-file"
                                type="file"
                                accept="*/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-600">
                    Post
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mt-2"
                >
                    Cancel
                </button>
            </form>
        </div>
    </div>
);
};

export default CreatePostModal;