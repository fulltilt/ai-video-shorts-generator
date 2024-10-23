"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";

export const SignInButton = (props: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading && (
        <LoadingSpinner className="absolute left-[35%] top-[35%] grid place-items-center text-sky-600" />
      )}
      <Button
        className={props.className}
        style={{ cursor: "pointer" }}
        onClick={async () => {
          setLoading(true);
          router.push("/auth/signin");
          setLoading(false);
        }}
      >
        {props.children ?? "Sign In"}
      </Button>
    </div>
  );
};
