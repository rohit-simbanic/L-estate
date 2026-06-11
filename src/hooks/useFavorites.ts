import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';

export const useFavorites = () => {
  const { favorites, toggleFavorite } = useStore(
    useShallow((state) => ({
      favorites: state.favorites,
      toggleFavorite: state.toggleFavorite,
    })),
  );

  const isFavorite = (id: string) => favorites.includes(id);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
