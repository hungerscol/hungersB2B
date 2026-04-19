
import { useState, useEffect } from 'react';
import { MenuItem, LocationCode } from '../types.ts';
import { subscribeToMenuItemsByLocation, subscribeToMenuItemsByCook } from '../data.ts';

export const useMenuItems = (location: LocationCode) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToMenuItemsByLocation(location, (newItems) => {
            setItems(newItems);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [location]);

    return { items, loading };
};

export const useCookMenuItems = (cookId: string | undefined) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!cookId) return;
        setLoading(true);
        const unsubscribe = subscribeToMenuItemsByCook(cookId, (newItems) => {
            setItems(newItems);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [cookId]);

    return { items, loading };
};
