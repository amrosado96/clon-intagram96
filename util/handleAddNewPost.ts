// import React from 'react';
// import imageCompression from 'browser-image-compression';
// import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
// import {
//   getFirestore,
//   updateDoc,
//   doc,
//   addDoc,
//   collection,
//   query,
//   orderBy,
//   limit,
//   getDocs,
//   arrayUnion,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { User } from 'firebase/auth';
// import app from './firbaseConfig';
// import { notificationTypes, userDetailTypes } from './atoms';

// interface selectedImageProps {
//   e: any;
//   setSelectedImage: React.Dispatch<React.SetStateAction<File | undefined>>;
//   setImageSelected: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export function handleSelectedImage({
//   e,
//   setSelectedImage,
//   setImageSelected,
// }: selectedImageProps) {
//   const fileType = e.target.files[0].type;
//   const imageFile = e.target.files[0];

//   if (
//     fileType === 'image/png' ||
//     fileType === 'image/jpg' ||
//     fileType === 'image/jpeg'
//   ) {
//     setSelectedImage(imageFile);
//     setImageSelected(true);
//   } else {
//     console.log('please only use .png, .jpg, .jpeg file types');
//   }
// }

// interface handleSubmitProps {
//   url: string;
//   userNotifications: notificationTypes;
//   userDetails: userDetailTypes | User;
//   caption: string;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
// }

// async function handleSubmitToDB({
//   url,
//   userNotifications,
//   userDetails,
//   caption,
// }: handleSubmitProps) {
//   const db = getFirestore(app);
//   const userRef = doc(db, 'users', userNotifications.username!);
//   const userPostDocRef = doc(
//     db,
//     `${userNotifications.username}Posts`,
//     'userPosts'
//   );

//   // add to post count
//   updateDoc(userRef, {
//     // eslint-disable-next-line no-unsafe-optional-chaining
//     postCount: userNotifications.postCount! + 1,
//   });

//   const postCaption = {
//     text: caption,
//     avatarURL: userDetails.photoURL,
//     username: userDetails.displayName,
//     createdAt: new Date().toLocaleDateString(),
//   };

//   // create document within 'username'Posts
//   await addDoc(collection(db, `${userNotifications.username}Posts`), {
//     createdAt: serverTimestamp(),
//     imgURL: url,
//     likeCount: 0,
//     comments: [postCaption],
//     postID: '',
//     likes: [],
//   });

//   // get latest added doc ID
//   const q = query(
//     collection(db, `${userNotifications.username}Posts`),
//     orderBy('createdAt', 'desc'),
//     limit(1)
//   );
//   let latestPostId: string;
//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((latestPost: any) => {
//     latestPostId = latestPost.id;
//   });

//   // update users post list with the latest document ID
//   updateDoc(userPostDocRef, {
//     postsListArray: arrayUnion(latestPostId!),
//   });

//   // add document ID to within the post document
//   const docRef = doc(db, `${userNotifications.username!}Posts`, latestPostId!);
//   updateDoc(docRef, {
//     postID: latestPostId!,
//   });
// }

// interface submitProps {
//   userNotifications: notificationTypes;
//   userDetails: userDetailTypes | User;
//   caption: string;
//   selectedImage: File;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export async function handleSubmit({
//   userNotifications,
//   userDetails,
//   caption,
//   selectedImage,
//   setLoading,
//   setAddPost,
// }: submitProps) {
//   const storage = getStorage();
//   const options = {
//     maxSizeMB: 1,
//     maxWidthOrHeight: 600,
//     useWebWorker: true,
//   };

//   setLoading(true);

//   const storageRef = ref(
//   storage,
//   `posts/${userDetails.displayName}/post-${(userNotifications?.postCount ?? 0) + 1}`
// );


//   // compress the image
//   const compressedFile = await imageCompression(selectedImage!, options);

//   // upload to storage, and then retrieve the usable URL
//   await uploadBytes(storageRef, compressedFile).then(() => {
//     // image uploaded
//   });
//   getDownloadURL(
//     ref(
//       storage,
//       `posts/${userDetails.displayName}/post-${(userNotifications?.postCount ?? 0) + 1}`
//     )
//   )
//     .then((url) => {
//       setLoading(false);
//       setAddPost(false);
//       handleSubmitToDB({
//         url,
//         userNotifications,
//         userDetails,
//         caption,
//         setLoading,
//         setAddPost,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       setLoading(false);
//     });
// }

import React from 'react';
import imageCompression from 'browser-image-compression';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getFirestore,
  updateDoc,
  doc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

// ⚠️ Si tu archivo se llama firebaseConfig (con "e"), cambia esta línea:
import app from './firbaseConfig';

import { notificationTypes, userDetailTypes } from './atoms';

interface selectedImageProps {
  e: any;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  setImageSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleSelectedImage({
  e,
  setSelectedImage,
  setImageSelected,
}: selectedImageProps) {
  const file = e?.target?.files?.[0];
  if (!file) return;

  const type = file.type;
  if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg') {
    setSelectedImage(file);
    setImageSelected(true);
  } else {
    console.log('Por favor usa solo archivos .png, .jpg o .jpeg');
  }
}

// Args mínimos que usa la función (quitamos los que no se usan)
type HandleSubmitToDBArgs = {
  url: string;
  userNotifications: notificationTypes;
  userDetails: userDetailTypes | User;
  caption: string;
};

async function handleSubmitToDB({
  url,
  userNotifications,
  userDetails,
  caption,
}: HandleSubmitToDBArgs) {
  const db = getFirestore(app);

  const username = userNotifications.username!;
  const userRef = doc(db, 'users', username);
  const postsCollection = `${username}Posts`;
  const userPostDocRef = doc(db, postsCollection, 'userPosts');

  // 1) Incrementar contador de posts
  await updateDoc(userRef, {
    postCount: (userNotifications.postCount ?? 0) + 1,
  });

  const postCaption = {
    text: caption,
    avatarURL: (userDetails as any)?.photoURL ?? null,
    username:
      (userDetails as any)?.displayName ??
      (userDetails as any)?.username ??
      username,
    createdAt: new Date().toLocaleDateString(),
  };

  // 2) Crear el post (sin ID aún)
  await addDoc(collection(db, postsCollection), {
    createdAt: serverTimestamp(),
    imgURL: url,
    likeCount: 0,
    comments: [postCaption],
    postID: '',
    likes: [],
  });

  // 3) Obtener el último post y su ID
  const q = query(
    collection(db, postsCollection),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  let latestPostId = '';
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((latestPost: any) => {
    latestPostId = latestPost.id;
  });

  if (!latestPostId) {
    console.warn('No se pudo obtener el ID del último post');
    return;
  }

  // 4) Agregar el ID a la lista de posts del usuario
  await updateDoc(userPostDocRef, {
    postsListArray: arrayUnion(latestPostId),
  });

  // 5) Guardar el postID dentro del documento del post
  const docRef = doc(db, postsCollection, latestPostId);
  await updateDoc(docRef, {
    postID: latestPostId,
  });
}

interface submitProps {
  userNotifications: notificationTypes;
  userDetails: userDetailTypes | User;
  caption: string;
  selectedImage: File;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
}

export async function handleSubmit({
  userNotifications,
  userDetails,
  caption,
  selectedImage,
  setLoading,
  setAddPost,
}: submitProps) {
  const storage = getStorage(app); // ✅ usar la app inicializada

  // compresión ligera para subir más rápido
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 600,
    useWebWorker: true,
  };

  try {
    setLoading(true);

    // Carpeta segura: username > displayName > uid
    const baseName =
      userNotifications?.username ||
      (userDetails as any)?.displayName ||
      (userDetails as any)?.uid ||
      'anon';

    const safeName = String(baseName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-'); // solo letras/números/guiones

    // Nombre único para el archivo (evita choques con postCount)
    const filename = `post-${Date.now()}`;

    const storageRef = ref(storage, `posts/${safeName}/${filename}`);

    // 1) Comprimir imagen
    const compressedFile = await imageCompression(selectedImage, options);

    // 2) Subir
    await uploadBytes(storageRef, compressedFile);

    // 3) Obtener URL pública
    const url = await getDownloadURL(storageRef);
    console.log('URL subida:', url); // 👈 verifica esto en la consola del navegador

    // 4) Guardar en Firestore
    await handleSubmitToDB({
      url,
      userNotifications,
      userDetails,
      caption,
    });

    // 5) Actualizar UI
    setAddPost(false);
  } catch (err) {
    console.error('Error al subir/publicar:', err);
  } finally {
    setLoading(false);
  }
}
