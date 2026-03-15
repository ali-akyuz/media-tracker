import React, { createContext, useState, useEffect } from 'react';
import { 
  moviesData as initMovies, 
  seriesData as initSeries, 
  booksData as initBooks, 
  notesData as initNotes, 
  plannerData as initPlanner 
} from '../data';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userUid, setUserUid] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [movies, setMovies] = useState(initMovies);
  const [series, setSeries] = useState(initSeries);
  const [books, setBooks] = useState(initBooks);
  const [notes, setNotes] = useState(initNotes);
  const [planner, setPlanner] = useState(initPlanner);

  // Monitor auth state to load user data from Firebase
  useEffect(() => {
    let unmounted = false;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (unmounted) return;

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.movies) setMovies(data.movies);
          if (data.series) setSeries(data.series);
          if (data.books) setBooks(data.books);
          if (data.notes) setNotes(data.notes);
          if (data.planner) setPlanner(data.planner);
        } else {
          // If no doc exists for this user, create one with initial generic empty fallback
          const newDoc = {
            movies: [],
            series: [],
            books: [],
            notes: [],
            planner: initPlanner
          };
          await setDoc(docRef, newDoc);
          setMovies(newDoc.movies);
          setSeries(newDoc.series);
          setBooks(newDoc.books);
          setNotes(newDoc.notes);
          setPlanner(newDoc.planner);
        }
        
        // ONLY SET USER AFTER DATA FETCH IS DONE!
        // This prevents the save effect from overwriting cloud data with local dummy data.
        setUserUid(user.uid); 
        setIsDataLoaded(true);
      } else {
        setIsDataLoaded(false);
        setUserUid(null);
        // Reset to initial or empty if logged out
        setMovies(initMovies);
        setSeries(initSeries);
        setBooks(initBooks);
        setNotes(initNotes);
        setPlanner(initPlanner);
      }
    });

    return () => {
      unmounted = true;
      unsubscribe();
    };
  }, []);

  // Whenever data changes AND we have a logged in user, save to Firebase
  useEffect(() => {
    if (userUid && isDataLoaded) {
      const saveData = async () => {
        try {
          await setDoc(doc(db, 'users', userUid), {
            movies,
            series,
            books,
            notes,
            planner
          }, { merge: true });
        } catch (error) {
          console.error("Error saving data to Firebase:", error);
        }
      };
      
      const timeoutId = setTimeout(() => {
        saveData();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [movies, series, books, notes, planner, userUid, isDataLoaded]);

  return (
    <DataContext.Provider value={{
      movies, setMovies,
      series, setSeries,
      books, setBooks,
      notes, setNotes,
      planner, setPlanner
    }}>
      {children}
    </DataContext.Provider>
  );
};
