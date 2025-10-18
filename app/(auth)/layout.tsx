import React from "react";

export default function Authlayout({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center pt-40">{children}</div>;
}
