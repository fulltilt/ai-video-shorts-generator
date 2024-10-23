"use client";

import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/api/auth/signOutServerAcion";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";

export const SignOutButton = (props: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative">
      {loading && (
        <LoadingSpinner className="absolute left-[35%] top-[35%] grid place-items-center text-sky-600" />
      )}
      <Button
        className={props.className}
        style={{ cursor: "pointer" }}
        onClick={async () => {
          setLoading(true);
          await handleSignOut();
          setLoading(false);
        }}
      >
        {props.children ?? "Sign Out"}
      </Button>
    </div>
  );
};
