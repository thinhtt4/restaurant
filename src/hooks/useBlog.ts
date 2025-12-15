// src/hooks/useBlog.ts
import { useState, useCallback } from "react";
import { useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from "@/store/api/blogApi";
import type { BlogResponse, BlogRequest } from "@/types/blog.type";

export function useBlog() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selected, setSelected] = useState<BlogResponse | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<string>("");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [createBlogMutation] = useCreateBlogMutation();
    const [updateBlogMutation] = useUpdateBlogMutation();
    const [deleteBlogMutation] = useDeleteBlogMutation();

    const openAdd = useCallback(() => {
        setModalMode("add");
        setSelected(null);
        setModalOpen(true);
    }, []);

    const openEdit = useCallback((blog: BlogResponse) => {
        setModalMode("edit");
        setSelected(blog);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setSelected(null);
    }, []);

    const doCreate = useCallback(
        async (payload: BlogRequest) => {
            return createBlogMutation(payload).unwrap();
        },
        [createBlogMutation]
    );

    const doUpdate = useCallback(
        async (id: number, payload: BlogRequest) => {
            return updateBlogMutation({ id, body: payload }).unwrap();
        },
        [updateBlogMutation]
    );

    const askDelete = useCallback((id: number) => {
        const blog = selected;
        setDeleteId(id);
        setConfirmTarget(blog?.title || `Blog #${id}`);
        setConfirmOpen(true);
    }, [selected]);

    const cancelDelete = useCallback(() => {
        setConfirmOpen(false);
        setDeleteId(null);
        setConfirmTarget("");
    }, []);

    const doDelete = useCallback(async () => {
        if (deleteId === null) throw new Error("No blog selected for deletion");
        await deleteBlogMutation(deleteId).unwrap();
        setConfirmOpen(false);
        setDeleteId(null);
        setConfirmTarget("");
    }, [deleteId, deleteBlogMutation]);

    return {
        modalOpen,
        modalMode,
        selected,
        confirmOpen,
        confirmTarget,

        openAdd,
        openEdit,
        closeModal,
        doCreate,
        doUpdate,
        askDelete,
        cancelDelete,
        doDelete,
    };
}