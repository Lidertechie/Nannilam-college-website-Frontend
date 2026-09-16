import { useLayoutEffect, useRef } from "react";

export default function useNavbarHeightVar() {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const setVar = () => {
            const height = el.getBoundingClientRect().height;
            document.documentElement.style.setProperty(
                "--navbar-height",
                `${height}px`
            );
        };

        setVar();

        const observer = new ResizeObserver(setVar);
        observer.observe(el);

        window.addEventListener("resize", setVar);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", setVar);
        };
    }, []);

    return ref;
}