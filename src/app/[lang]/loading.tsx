import React from "react";

function Loading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center">
      <span className="relative flex h-20 w-20">
        <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"></span>
        <span className="bg-primary relative inline-flex h-20 w-20 rounded-full"></span>
        <span className="bg-primary-foreground border-primary absolute top-4 left-4 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-t-transparent opacity-80"></span>
      </span>
    </div>
  );
}

export default Loading;
