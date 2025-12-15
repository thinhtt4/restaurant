import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAccountQuery, useUpdateProfileMutation } from "@/store/api/userProfileApi";
import { setUser, updateUser } from "@/store/profileSlice";
import { useDispatch } from "react-redux";
import { profileSchema, type ProfileFormData } from "@/schemas/profileSchema";
import { toast } from "sonner";
import type { User } from "@/types/user.type";

export function useProfileManager(user: User | null) {
  const dispatch = useDispatch();
  const { data, isLoading: loadingFromApi } = useGetAccountQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "OTHER",
    },
  });

  const { reset, handleSubmit, formState: { errors }, register } = form;

  // Lưu user từ API vào Redux khi fetch xong
  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  // Reset form khi bật edit
  useEffect(() => {
    if (isEditing && user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        gender: (user.gender as "MALE" | "FEMALE" | "OTHER") ?? "OTHER",
      });
    }
  }, [isEditing, user, reset]);

  const onSubmit = async (values: ProfileFormData) => {
    try {
      const res = await updateProfile(values);
      if (res?.data?.data) {
        dispatch(updateUser(res.data.data));
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    }
  };

  return {
    isLoading: loadingFromApi || !user,
    isEditing,
    setIsEditing,
    updating,
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
