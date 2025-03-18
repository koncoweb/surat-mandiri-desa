
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  query, 
  where, 
  getDocs, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHY3o5IygUIBCbKGgeIiVk3DfRY3pfixs",
  authDomain: "koperasiku-47aad.firebaseapp.com",
  projectId: "koperasiku-47aad",
  storageBucket: "koperasiku-47aad.firebasestorage.app",
  messagingSenderId: "611589118581",
  appId: "1:611589118581:web:9d9babfc42618ad61a363c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Error signing in:", error);
    return { user: null, error };
  }
};

export const signUp = async (email: string, password: string, userData: Record<string, any>) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore (in both users and profiles collections)
    const userProfile = {
      ...userData,
      email,
      createdAt: serverTimestamp(),
      role: "viewer", // Default role for new users
    };
    
    // Save to users collection (for backward compatibility)
    await setDoc(doc(db, "users", user.uid), userProfile);
    
    // Also save to profiles collection
    await setDoc(doc(db, "profiles", user.uid), userProfile);
    
    return { user, error: null };
  } catch (error) {
    console.error("Error signing up:", error);
    return { user: null, error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error };
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getUserRole = async (uid: string): Promise<string | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

// Letter functions
export const createLetter = async (letterData: Record<string, any>, userId: string) => {
  try {
    // Get the current year
    const now = new Date();
    const year = now.getFullYear();
    
    // Get the latest letter number for the current year
    const lettersRef = collection(db, "letters");
    const q = query(
      lettersRef,
      where("year", "==", year),
      orderBy("number", "desc"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    let nextNumber = 1; // Default to 1 if no letters exist for this year
    
    if (!querySnapshot.empty) {
      const latestLetter = querySnapshot.docs[0].data();
      nextNumber = (latestLetter.number || 0) + 1;
    }
    
    // Generate letter number according to Indonesian format
    // Format: [Number]/[Code]/[Village]/[Month]/[Year]
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Get village info from user
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const villageCode = userData.villageCode || "DESA";
    
    // Get letter code based on type
    const letterType = letterData.type || "UMUM";
    let typeCode = "UMUM";
    
    switch (letterType) {
      case "KETERANGAN":
        typeCode = "KET";
        break;
      case "REKOMENDASI":
        typeCode = "REK";
        break;
      case "PENGUMUMAN":
        typeCode = "PENG";
        break;
      case "UNDANGAN":
        typeCode = "UND";
        break;
      default:
        typeCode = "UMUM";
    }
    
    const letterNumber = `${nextNumber.toString().padStart(3, '0')}/${typeCode}/${villageCode}/${month}/${year}`;
    
    // Create new letter document
    const newLetterRef = doc(collection(db, "letters"));
    await setDoc(newLetterRef, {
      ...letterData,
      letterNumber,
      number: nextNumber,
      year,
      month,
      createdBy: userId,
      createdAt: serverTimestamp(),
      status: "draft",
      id: newLetterRef.id
    });
    
    return { id: newLetterRef.id, letterNumber, error: null };
  } catch (error) {
    console.error("Error creating letter:", error);
    return { id: null, letterNumber: null, error };
  }
};

export const getLetters = async (filters = {}) => {
  try {
    const lettersRef = collection(db, "letters");
    let q = query(lettersRef, orderBy("createdAt", "desc"));
    
    // Apply filters if any
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          q = query(q, where(key, "==", value));
        }
      });
    }
    
    const querySnapshot = await getDocs(q);
    const letters = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate() 
        : doc.data().createdAt
    }));
    
    return { letters, error: null };
  } catch (error) {
    console.error("Error getting letters:", error);
    return { letters: [], error };
  }
};

export const getLetter = async (id: string) => {
  try {
    const letterDoc = await getDoc(doc(db, "letters", id));
    if (!letterDoc.exists()) {
      throw new Error("Letter not found");
    }
    
    const letterData = letterDoc.data();
    return { 
      letter: {
        id: letterDoc.id,
        ...letterData,
        createdAt: letterData.createdAt instanceof Timestamp 
          ? letterData.createdAt.toDate() 
          : letterData.createdAt
      }, 
      error: null 
    };
  } catch (error) {
    console.error("Error getting letter:", error);
    return { letter: null, error };
  }
};

export const updateLetter = async (id: string, data: Record<string, any>) => {
  try {
    const letterRef = doc(db, "letters", id);
    await updateDoc(letterRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating letter:", error);
    return { success: false, error };
  }
};

// User management functions
export const getUsers = async (role?: string) => {
  try {
    const usersRef = collection(db, "users");
    let q = query(usersRef);
    
    if (role) {
      q = query(usersRef, where("role", "==", role));
    }
    
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate() 
        : doc.data().createdAt
    }));
    
    return { users, error: null };
  } catch (error) {
    console.error("Error getting users:", error);
    return { users: [], error };
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error };
  }
};

// File upload functions
export const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { url: downloadURL, error: null };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { url: null, error };
  }
};

export { auth, db, storage };
export default app;
