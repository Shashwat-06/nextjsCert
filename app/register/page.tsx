"use client";

import { useActionState } from "react";
import { registerUser, type RegisterState } from "../actions/users";

const initialState: RegisterState = {
  error: "",
  fieldErrors: {},
};

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div>
      <h2>Register</h2>
      <form action={formAction}>
        {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" name="username" required />
          {state?.fieldErrors?.username && (
            <span data-testid="username-error" style={{ color: "red" }}>
              {state.fieldErrors.username}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="passwordConfirm"
            required
          />
          {state?.fieldErrors?.passwordConfirm && (
            <span data-testid="passwordConfirm-error" style={{ color: "red" }}>
              {state.fieldErrors.passwordConfirm}
            </span>
          )}
        </div>
        <button type="submit" data-testid="register-button">
          Register
        </button>
      </form>
    </div>
  );
}
