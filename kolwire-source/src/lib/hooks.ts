import { useCallback, useEffect, useState } from "react";

/** Theme toggle persisted to localStorage. */
export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  const toggle = useCallback(() => {
    setDark((d) => {
      const n = !d;
      document.documentElement.classList.toggle("dark", n);
      localStorage.setItem("kolwire-theme", n ? "dark" : "light");
      return n;
    });
  }, []);
  return { dark, toggle };
}

export interface AnalystNote { id: string; text: string; author: string; createdAt: string }

/** Analyst notes per post, stored in this browser only (localStorage). */
export function useNotes(postId: string) {
  const key = `kolwire-notes-${postId}`;
  const [notes, setNotes] = useState<AnalystNote[]>([]);
  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setNotes([]); }
  }, [key]);
  const save = (n: AnalystNote[]) => { setNotes(n); localStorage.setItem(key, JSON.stringify(n)); };
  return {
    notes,
    add: (text: string, author: string) => save([{ id: crypto.randomUUID(), text, author: author || "Analyst", createdAt: new Date().toISOString() }, ...notes]),
    remove: (id: string) => save(notes.filter((n) => n.id !== id)),
  };
}
