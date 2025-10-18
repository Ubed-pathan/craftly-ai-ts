import React from "react";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto mt-24 mb-20">{children}</div>;
}
