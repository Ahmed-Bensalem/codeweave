// app/components/LimitChecker.ts
import { useEffect, useState } from 'react';

const USAGE_KEY = 'codeweave-usage';

export default function useLimitCheck() {
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(USAGE_KEY);
    const today = new Date().toDateString();

    if (saved) {
      const { date, count } = JSON.parse(saved);
      if (date === today && count >= 3) {
        setLimitReached(true);
      }
    }
  }, []);

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(USAGE_KEY);
    let data = { date: today, count: 0 };

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        data.count = parsed.count + 1;
      }
    } else {
      data.count = 1;
    }

    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: data.count }));

    if (data.count >= 3) {
      setLimitReached(true);
    }
  };

  return { limitReached, incrementUsage };
}
