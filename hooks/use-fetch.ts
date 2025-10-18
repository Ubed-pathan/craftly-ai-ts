import { useState } from "react";
import { toast } from "sonner";

export default function useFetch<TData = unknown, TArgs extends any[] = any[]>(
  cb: (...args: TArgs) => Promise<TData> | TData
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fn = async (...args: TArgs): Promise<TData | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response as TData);
      setError(null);
      return response as TData;
    } catch (err: any) {
      setError(err);
      toast.error(err?.message ?? "Something went wrong");
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData } as const;
}
