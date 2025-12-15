import type { User } from "@/types/user.type";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  profile: User | null
}

const initialState: UserState = {
  profile: null,
}

const profileSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.profile = action.payload;
    },
    updateUser(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateAvatarUser(state, action) {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          avatar: action.payload.avatar
        };
      }
    },
    clearUser(state) {
      state.profile = null;
    },
  },
});


export const { setUser, updateUser, updateAvatarUser, clearUser } = profileSlice.actions;
export default profileSlice.reducer;