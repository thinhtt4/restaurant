import { useEffect } from 'react';
import { websocketService } from "../service/websocket";
import { useAuth } from './useAuth';


interface BlogUpdateMessage {
    action: 'created' | 'updated' | 'deleted';
    blogId?: number;
    title?: string;
}

export function useBlogSync(refetch: () => void) {
    const { user } = useAuth();

    useEffect(() => {
        // Connect WebSocket
        websocketService.connect(user?.data.id ?? 0);

        // Subscribe to blog updates
        const unsubscribe = websocketService.subscribe('blog-updates', (data: BlogUpdateMessage) => {

            switch (data.action) {
                case 'created':
                    break;
                case 'updated':
                    break;
                case 'deleted':
                    break;
            }

            // Refetch data
            refetch();
        });

        return () => {
            unsubscribe();
        };
    }, []);
}