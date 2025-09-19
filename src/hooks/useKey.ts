import { useEffect } from "react";


export function useKey(key: string, action: () => void): void {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [key, action])
}