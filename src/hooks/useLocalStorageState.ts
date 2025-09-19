import {useState, useEffect, Dispatch, SetStateAction} from "react";

export function useLocalStorageState<T>(initionalState: T, key: string): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(function() {
        const storedValue = localStorage.getItem(key)
        return storedValue ? JSON.parse(storedValue) : initionalState;
    });

    useEffect(function(){
        localStorage.setItem('watched', JSON.stringify(value))
    },[value, key])

    return [value, setValue]
};