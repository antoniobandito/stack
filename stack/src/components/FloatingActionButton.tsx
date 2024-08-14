import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreatePostModal from './CreatePostModal';

const FloatingActionButton: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <div className='absolute bottom-20 right-8'>
        <button
        onClick={handleOpenModal}
        className='w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-black hover:text-white focus:outline-none'
        >
          <FaPlus size={24} />
        </button>
        </div> 

        {isModalOpen && <CreatePostModal onClose={handleCloseModal} />}
    </>
  )
}

export default FloatingActionButton