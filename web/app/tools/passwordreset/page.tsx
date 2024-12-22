"use client";
import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { variant } from "@material-tailwind/react/types/components/typography";
import { color } from "@material-tailwind/react/types/components/alert";

const unusedProps = {
  placeholder: undefined,
  onPointerEnterCapture: undefined,
  onPointerLeaveCapture: undefined,
};

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [renderedEmail, setRenderedEmail] = useState<string | null>(null);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [responseSuccess, setResponseSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on input
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponseError(null);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await fetch(`/api/tools/passwordreset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setRenderedEmail(data.data.textMessage);
        setResponseSuccess("Email rendered successfully.");
      } else {
        setResponseError(`An error occurred. ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseError(`An error occurred. ${error}`);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="p-6 lg:w-1/2">
        <Card color="transparent" shadow={false} {...unusedProps}>
          <Text variant="h4" color="blue-gray">
            Password Reset Email
          </Text>
          <Text color="gray" className="mt-1 font-normal">
            This form will send a password reset email to the provided email
          </Text>
          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            onSubmit={handleSubmit}
          >
            <div className="mb-1 flex flex-col gap-6">
              <Text variant="h6" color="blue-gray" className="-mb-3">
                Name
              </Text>
              <Input
                size="lg"
                {...unusedProps}
                placeholder="Person's name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin={undefined}
                name="name"
                onChange={handleChange}
              />
              <ErrorMsg error={errors.name} />
              <Text variant="h6" color="blue-gray" className="-mb-3">
                Email address
              </Text>
              <Input
                size="lg"
                {...unusedProps}
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin={undefined}
                name="email"
                onChange={handleChange}
              />
              <ErrorMsg error={errors.email} />
              {/* ------------------------------------ */}
              <Text variant="h6" color="blue-gray" className="-mb-3">
                Username
              </Text>
              <Input
                type="text"
                size="lg"
                {...unusedProps}
                placeholder="Username"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin={undefined}
                name="username"
                onChange={handleChange}
              />
              <ErrorMsg error={errors.username} />
              {/* ------------------------------------ */}
              <Text variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Text>
              <Input
                type="text"
                size="lg"
                {...unusedProps}
                placeholder="New password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin={undefined}
                name="password"
                onChange={handleChange}
              />
              <ErrorMsg error={errors.password} />
              {/* ------------------------------------ */}
            </div>
            <Button className="mt-6" fullWidth {...unusedProps} type="submit">
              Send reminder
            </Button>
            {responseError && (
              <p className="mt-4 text-red-500">{responseError}</p>
            )}
            {responseSuccess && (
              <p className="mt-4 text-green-500">{responseSuccess}</p>
            )}
          </form>
        </Card>
      </div>
      {/* Second Column: Rendered Email */}
      <div className="bg-gray-50 p-6 lg:w-1/2">
        <h2 className="text-lg font-semibold text-gray-800">Rendered Email</h2>
        {renderedEmail
          ? (
            <textarea
              className="mt-4 w-full h-80 p-2 border border-gray-300 rounded-md"
              value={renderedEmail}
              readOnly
            >
            </textarea>
          )
          : (
            <p className="mt-4 text-gray-500">
              No email rendered yet. Submit the form to see it here.
            </p>
          )}
      </div>
    </div>
  );
};

const ErrorMsg = ({ error }: { error: string }) => {
  if (!error) return null;
  if (error === "") return null;
  return (
    <Text variant="h6" color="red" className="-mb-3">
      {error}
    </Text>
  );
};

type TextProps = {
  variant?: variant;
  color?: color;
  className?: string;
  children: React.ReactNode;
};

const Text = (props: TextProps) => {
  return (
    <Typography
      variant={props.variant}
      color={props.color}
      className={props.className}
      {...unusedProps}
    >
      {props.children}
    </Typography>
  );
};

export default withPageAuthRequired(PasswordReset);
