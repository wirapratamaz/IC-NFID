"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewPage() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div>Simple Login with NFID and Internet Identity.....</div>;
  }

  return (
    <div>
    </div>
  );
}
