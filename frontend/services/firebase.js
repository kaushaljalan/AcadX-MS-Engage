// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,
	signInWithCustomToken, signInWithEmailAndPassword, signOut as firebaseSignout, getIdTokenResult } from 'firebase/auth'
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCpmrDCM9ZUHtJykxmXH-VmFvGTLRlUuAc",
	authDomain: "acadx-1da34.firebaseapp.com",
	projectId: "acadx-1da34",
	storageBucket: "acadx-1da34.appspot.com",
	messagingSenderId: "92947591924",
	appId: "1:92947591924:web:e4ab9669bda3e9b9fc64a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signout = () => firebaseSignout(auth);
export const signInWithToken = (token) => signInWithCustomToken(auth, token);
export const storage = getStorage(app);
export const getRef = (path) => ref(storage, path)
export const uploadFile = (filename, file, type) => {
	console.log(filename, file, type)
	return new Promise((resolve, reject) => {
		uploadBytesResumable(getRef(filename), file, {
			contentType: type
		}).then((snapshot) => resolve(snapshot))
	})
}
export const getUrlToDownload = (path) => {
	return new Promise((resolve, reject) => {
		getDownloadURL(getRef(path)).then(url => resolve(url))
	});
}
export default app;