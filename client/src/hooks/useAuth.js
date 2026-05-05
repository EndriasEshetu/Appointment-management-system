import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/authApi";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // data contains _id, name, email, role, token
      setCredentials(data, data.token);
      navigate("/"); // Redirect to dashboard/home after login
    },
  });
};

export const useRegister = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setCredentials(data, data.token);
      navigate("/"); // Redirect to dashboard/home after register
    },
  });
};
