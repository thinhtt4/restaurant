

import { createContext } from "react";


export interface LikesContextType {
  likes: Record<number, boolean>;
  likeCount: Record<number, number>;
  toggleLike: (postId: number) => void;
}


export const LikesContext = createContext<LikesContextType | undefined>(
  undefined
);