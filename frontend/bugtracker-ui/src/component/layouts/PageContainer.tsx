import type React from "react";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="space-y-6">
      {title && <h1 className="text-2xl font-bold text-gray-800">{title}</h1>}
      {children}
    </div>
  );
};

export default PageContainer;
