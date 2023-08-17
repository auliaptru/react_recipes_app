import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';

const useFirestore = (collectionName) => {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let unsubscribe;
        const getData = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, collectionName),
                    orderBy('timestamp', 'desc')
                );
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const data = [];
                    querySnapshot.forEach((doc) => {
                        data.push({ id: doc.id, ...doc.data() });
                    });
                    setFormData(data);
                    setLoading(false);
                });
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        getData();
        return () => unsubscribe && unsubscribe();
    }, [collectionName]);

    return { formData, loading };
};

export default useFirestore;
