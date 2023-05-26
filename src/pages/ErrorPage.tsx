import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => navigate("/signin"), []);

  return <h2 className="text-center">This page doesn't exist, redirecting you to the sign up page</h2>;
}

export default ErrorPage;