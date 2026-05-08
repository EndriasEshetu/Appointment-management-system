import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/authApi";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables) => {
      setCredentials(data, data.token, variables.rememberMe);
      navigate("/"); 
    },
  });
};

export const useRegister = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setCredentials(data, data.token, true);
      navigate("/");
    },
  });
};
