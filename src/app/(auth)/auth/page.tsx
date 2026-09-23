"use client";

import LoginForm from "@/components/auth/LoginForm";
import React from "react";

const AuthPage = () => {
  return (
    <div className="w-[400px] mt-16">
      <div className="p-4 border-t border-border bg-card">
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthPage;
