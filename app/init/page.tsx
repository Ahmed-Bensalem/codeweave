'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useInitTries } from "../hooks/useInitTries";

export default function InitPage() {
  useInitTries();

  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard"); // or wherever you want
  }, []);

  return null; // or a spinner/loading screen
}
