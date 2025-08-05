"use client";

import React from "react";

const loadingText: string = "Loading awesome content now, please stand by ⏳";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center w-full py-10">
      <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="ml-4 text-gray-300">{loadingText}</span>
    </div>
  );
}
