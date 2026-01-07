'use client';

import { useLocalStorage } from './useLocalStorage';
import { CollectionItem } from '@/types/user';

export function useCollection() {
  const [collection, setCollection, isLoading] = useLocalStorage<CollectionItem[]>('art-pick-collection', []);

  const addToCollection = (artworkId: string, spotId: string) => {
    const newItem: CollectionItem = {
      artworkId,
      spotId,
      collectedAt: new Date(),
      location: {
        latitude: 37.6524,
        longitude: 127.6874,
      },
    };

    setCollection((prev) => {
      // 이미 수집한 작품인지 확인
      if (prev.some((item) => item.artworkId === artworkId)) {
        return prev;
      }
      return [...prev, newItem];
    });

    return newItem;
  };

  const isCollected = (artworkId: string) => {
    return collection.some((item) => item.artworkId === artworkId);
  };

  const getCollectionCount = () => {
    return collection.length;
  };

  const clearCollection = () => {
    setCollection([]);
  };

  return {
    collection,
    isLoading,
    addToCollection,
    isCollected,
    getCollectionCount,
    clearCollection,
  };
}
