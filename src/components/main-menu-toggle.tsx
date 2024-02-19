"use client";

import * as React from "react";
import { NFIDProvider, signIn, signOut } from "@junobuild/core-peer";


export function MainMenuToggle() {
  async function handleLogin() {
    await signIn({
      provider: new NFIDProvider({
        appName: "paste.digital",
        logoUrl: "https://somewhere.com/your_logo.png",
      }),
    });
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {
        <button 
          onClick={handleLogin} 
          style={{ padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Login / Register
        </button>
      }
      {
        <button 
          onClick={signOut} 
          style={{ padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      }
    </div>
  );
}

export default MainMenuToggle;
