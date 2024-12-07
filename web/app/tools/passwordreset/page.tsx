"use client";

import Image from "next/image";

import RootLayout from "../../layout";

import { useState } from 'react';

const apiHost = process.env.NEXT_PUBLIC_API_HOST;

const PasswordReset = () => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      username: '',
      password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [renderedEmail, setRenderedEmail] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' })); // Clear errors on input
  };

  const validateForm = () => {
      const newErrors: { [key: string]: string } = {};
      if (!formData.name.trim()) newErrors.name = 'Name is required.';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = 'Valid email is required.';
      if (!formData.username.trim()) newErrors.username = 'Username is required.';
      if (!formData.password.trim() || formData.password.length < 6)
          newErrors.password = 'Password must be at least 6 characters.';
      return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
      }
      try {
          const response = await fetch(`${apiHost}/tools/passwordreset`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
          });

          const data = await response.json();

          if (response.ok) {
              setRenderedEmail(data.renderedEmail); // Assume the API returns this
          } else {
              console.error('Error:', data.error);
          }
      } catch (error) {
          console.error('Error submitting form:', error);
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Password Reset
        </h1>

        <div className="flex gap-8">
            {/* First Column: Form */}
            <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Second Column: Rendered Email */}
            <div className="flex-1 bg-gray-50 shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    Rendered Email
                </h2>
                {renderedEmail ? (
                    <p className="mt-4 text-gray-700">{renderedEmail}</p>
                ) : (
                    <p className="mt-4 text-gray-500">
                        No email rendered yet. Submit the form to see it here.
                    </p>
                )}
            </div>
        </div>
    </div>
);
};


export default PasswordReset;