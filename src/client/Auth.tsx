import { SignupForm } from "@wasp/auth/forms/Signup";
import { VerifyEmailForm } from "@wasp/auth/forms/VerifyEmail";
import { ForgotPasswordForm } from "@wasp/auth/forms/ForgotPassword";
import { ResetPasswordForm } from "@wasp/auth/forms/ResetPassword";
import { Link } from "react-router-dom";
import { login, signup } from "@wasp/auth/email";
import { VStack, FormControl, FormLabel, Input, Button, Text, Heading } from "@chakra-ui/react";
import BorderBox from "./components/BorderBox";
import type { CustomizationOptions } from "@wasp/auth/forms/types";

export function EmailLoginForm() {
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;
    try {
      await login({ email, password });
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <VStack id="wut" w="full">
      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <VStack spacing={0} gap={2} mt={3}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" />
          </FormControl>
          <Button alignSelf="start" mt={3} type="submit">
            Login
          </Button>
          <VStack alignItems="flex-start" gap={1} mt={4} w="full">
            <Text fontSize="sm" color='text-contrast-lg'>
              Don't have an account yet?{" "}
              <Link to="/email-signup">
                <Text as="u">go to signup</Text>
              </Link>
              .
            </Text>
            <Text fontSize="sm" color='text-contrast-lg'>
              Forgot your password?{" "}
              <Link to="/request-password-reset">
                <Text as="u">reset it</Text>
              </Link>
              .
            </Text>
          </VStack>
        </VStack>
      </form>
    </VStack>
  );
}

export function EmailSignupForm() {
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const username = form.email.value;
    const password = form.password.value;
    try {
      await signup({ email, password, username });
    } catch (error) {
      console.log(error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <BorderBox>
      <VStack spacing={6} w='70%'>
        <Heading as="h1" size="xl">
          Sign Up 
        </Heading>
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <VStack spacing={0} gap={2} mt={3}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Button alignSelf='start' mt={3} type="submit">
              Sign Up
            </Button>
            <VStack alignItems="flex-start" gap={1} mt={3} w='full'>
              <Text fontSize="sm">
                Already have an account?{" "}
                <Link to="/login">
                  <Text as="u">go to Login</Text>
                </Link>
                .
              </Text>
            </VStack>
          </VStack>
        </form>
      </VStack>
    </BorderBox>
  );
}

export function EmailVerification() {
  return (
    <BorderBox>
      <VerifyEmailForm appearance={authVerifyAppearance} />
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay,{" "}
        <Link to="/login">
          <Text as="u">go to login</Text>
        </Link>
      </span>
    </BorderBox>
  );
}

export const authVerifyAppearance: CustomizationOptions["appearance"] = {
  colors: {
    brand: "#5969b8", // blue
    brandAccent: "#de5998", // pink
    submitButtonText: "white",
  },
};

export function RequestPasswordReset() {
  return (
    <BorderBox>
      <ForgotPasswordForm appearance={authVerifyAppearance} />
    </BorderBox>
  );
}

export function PasswordReset() {
  return (
    <>
      <ResetPasswordForm />
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay, <Link to="/login">go to login</Link>
      </span>
    </>
  );
}

// A  component to center the content
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-white">
      <div className="min-w-full min-h-[75vh] flex items-center justify-center">
        <div className="w-full h-full max-w-sm p-5 bg-white">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
