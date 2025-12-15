
"use client";

import React, { useState, useEffect } from "react";

import { LikesContext } from "./likes-context"; 

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [likeCount, setLikeCount] = useState<Record<number, number>>({
    1: 234,
    2: 189,
    3: 156,
  });

  useEffect(() => {
    const savedLikes = localStorage.getItem("postLikes");
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("postLikes", JSON.stringify(likes));
  }, [likes]);

  const toggleLike = (postId: number) => {
    setLikes((prev) => {
      const newLikes = { ...prev };
      const isLiked = newLikes[postId];

      if (isLiked) {
        delete newLikes[postId];
        setLikeCount((prev) => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1),
        }));
      } else {
        newLikes[postId] = true;
        setLikeCount((prev) => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1,
        }));
      }

      return newLikes;
    });
  };

  return (
    <LikesContext.Provider value={{ likes, likeCount, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
}