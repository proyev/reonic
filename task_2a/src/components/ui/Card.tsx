import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export default function Card({ children, title, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {title && (
        <div className="bg-primary py-3 px-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
