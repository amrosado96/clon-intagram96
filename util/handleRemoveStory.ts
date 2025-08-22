import React from 'react';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import app from './firbaseConfig';

interface Props {
  username: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function handleRemoveStory({
  username,
  setLoading,
  setAddPhoto,
}: Props) {
  setLoading(true);

  const db = getFirestore(app);
  const storage = getStorage();
  const userRef = doc(db, 'users', username);
  const storyStorageRef = ref(storage, `stories/${username}`);

  // Quitar historia de la db
  updateDoc(userRef, {
    story: '',
    storyViews: [],
  });

  // Borrar imagen de la nube
  deleteObject(storyStorageRef)
    .then(() => {
      // Archivo borrado con exito
      setLoading(false);
      setAddPhoto(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setAddPhoto(false);
    });
}
