/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import DynamicForm, {
  FormDefinition,
} from "@/components/form-render/form-render";

const customFormDefinition: FormDefinition = {
  id: "contact-form",
  title: "Contact Us",
  showResetButton: true,
  resetButtonText: "Clear Form",
  fields: [
    {
      key: "firstName",
      type: "text",
      label: "First Name",
      required: true,
      placeholder: "Enter your first name",
      validation: {
        minLength: 2,
        maxLength: 50,
        messages: {
          required: "Please enter your first name",
          minLength: "First name must be at least 2 characters long",
          maxLength: "First name cannot exceed 50 characters",
        },
      },
    },
    {
      key: "lastName",
      type: "text",
      label: "Last Name",
      required: true,
      placeholder: "Enter your last name",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      key: "email",
      type: "email",
      label: "Email Address",
      required: true,
      placeholder: "Enter your email address",
      validation: {
        messages: {
          required: "Email address is required",
          email: "Please enter a valid email address",
        },
      },
    },
    {
      key: "phone",
      type: "text",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      validation: {
        pattern: "^[\\+]?[1-9][\\d]{0,15}$",
      },
    },
    {
      key: "subject",
      type: "select",
      label: "Subject",
      required: true,
      options: [
        { label: "General Inquiry", value: "general" },
        { label: "Technical Support", value: "technical" },
        { label: "Sales Question", value: "sales" },
        { label: "Feedback", value: "feedback" },
        { label: "Other", value: "other" },
      ],
    },
    {
      key: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Please describe your inquiry...",
      validation: {
        minLength: 10,
        maxLength: 1000,
      },
    },
    {
      key: "preferredContact",
      type: "radio",
      label: "Preferred Contact Method",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Either", value: "either" },
      ],
    },
    {
      key: "newsletter",
      type: "checkbox",
      label: "Subscribe to our newsletter",
    },
    {
      key: "urgency",
      type: "select",
      label: "Urgency Level",
      options: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
        { label: "Critical", value: "critical" },
      ],
    },
    {
      key: "age",
      type: "number",
      label: "Age",
      validation: {
        min: 13,
        max: 120,
        messages: {
          min: "You must be at least 13 years old",
          max: "Age cannot exceed 120 years",
        },
      },
    },
    {
      key: "country",
      type: "select",
      label: "Country",
      options: [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
        { label: "United Kingdom", value: "uk" },
        { label: "Germany", value: "de" },
        { label: "France", value: "fr" },
        { label: "Other", value: "other" },
      ],
    },
    {
      key: "attachments",
      type: "multi-file",
      label: "Attachments",
      description: "Upload supporting documents, images, or other files",
      validation: {
        maxFiles: 5,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        acceptedFileTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        messages: {
          required: "Please upload at least one file",
          maxFiles: "You can only upload up to 5 files",
          maxFileSize: "Each file must be smaller than 10MB",
          acceptedFileTypes: "Only images, PDFs, and documents are allowed",
        },
      },
    },
  ],
};

export default function FormDemoPage() {
  const handleFormSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl">
      <DynamicForm
        definition={customFormDefinition}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
