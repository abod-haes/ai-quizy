/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useCallback, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X, Upload, File, Image, FileText, Music, Video } from "lucide-react";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file"
  | "multi-file"
  | "group"
  | "array";

export type Option = { label: string; value: string | number };

export type FieldDefinition = {
  key: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  default?: any;
  required?: boolean;
  disabled?: boolean;
  options?: Option[] | (() => Promise<Option[]>);
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    maxFileSize?: number;
    acceptedFileTypes?: string[];
    maxFiles?: number;
    messages?: {
      required?: string;
      minLength?: string;
      maxLength?: string;
      min?: string;
      max?: string;
      pattern?: string;
      email?: string;
      maxFileSize?: string;
      acceptedFileTypes?: string;
      maxFiles?: string;
    };
  };
  fields?: FieldDefinition[];
  visibleIf?: { field: string; value: any };
};

export type FormDefinition = {
  id?: string;
  title?: string;
  fields: FieldDefinition[];
  showResetButton?: boolean;
  resetButtonText?: string;
  submitButtonText?: string;
  isLoading?: boolean;
};

const buildZodFromFields = (fields: FieldDefinition[]) => {
  const shape: Record<string, any> = {};

  fields.forEach((f) => {
    if (f.type === "group" && f.fields) {
      f.fields.forEach((groupField) => {
        const groupSchema = buildFieldSchema(groupField);
        shape[groupField.key] = groupSchema;
      });
      return;
    }

    const fieldSchema = buildFieldSchema(f);
    shape[f.key] = fieldSchema;
  });

  return z.object(shape);
};

const buildFieldSchema = (f: FieldDefinition) => {
  let schema: any;
  switch (f.type) {
    case "text":
    case "password":
    case "email":
    case "textarea":
      schema = z.string();
      if (f.required) {
        const requiredMessage =
          f.validation?.messages?.required || "This field is required";
        schema = schema.min(1, requiredMessage);
      }
      if (f.validation?.minLength) {
        const minLengthMessage =
          f.validation.messages?.minLength ||
          `Minimum length is ${f.validation.minLength}`;
        schema = schema.min(f.validation.minLength, minLengthMessage);
      }
      if (f.validation?.maxLength) {
        const maxLengthMessage =
          f.validation.messages?.maxLength ||
          `Maximum length is ${f.validation.maxLength}`;
        schema = schema.max(f.validation.maxLength, maxLengthMessage);
      }
      if (f.validation?.pattern) {
        const patternMessage =
          f.validation.messages?.pattern || "Invalid format";
        schema = schema.regex(new RegExp(f.validation.pattern), patternMessage);
      }
      if (f.type === "email") {
        const emailMessage =
          f.validation?.messages?.email || "Invalid email address";
        schema = schema.email(emailMessage);
      }
      break;
    case "number":
      let numberSchema = z.number();
      if (f.validation?.min) {
        const minMessage =
          f.validation.messages?.min || `Minimum value is ${f.validation.min}`;
        numberSchema = numberSchema.min(f.validation.min, minMessage);
      }
      if (f.validation?.max) {
        const maxMessage =
          f.validation.messages?.max || `Maximum value is ${f.validation.max}`;
        numberSchema = numberSchema.max(f.validation.max, maxMessage);
      }

      schema = z.preprocess((v) => {
        if (v === "" || v === undefined || v === null) return undefined;
        const n = Number(v);
        return Number.isNaN(n) ? v : n;
      }, numberSchema);

      if (!f.required) schema = schema.optional();
      break;
    case "checkbox":
      schema = z.boolean();
      if (f.required) {
        const requiredMessage =
          f.validation?.messages?.required || "This field is required";
        schema = schema.refine((val: any) => val === true, {
          message: requiredMessage,
        });
      } else {
        schema = schema.optional();
      }
      break;
    case "select":
    case "radio":
      schema = z.union([z.string(), z.number()]);
      if (f.required) {
        const requiredMessage =
          f.validation?.messages?.required || "Please select an option";
        schema = schema.refine(
          (val: any) => val !== undefined && val !== null && val !== "",
          { message: requiredMessage },
        );
      } else {
        schema = schema.optional();
      }
      break;
    case "date":
      schema = z.string();
      if (f.required) {
        const requiredMessage =
          f.validation?.messages?.required || "Please select a date";
        schema = schema.min(1, requiredMessage);
      } else {
        schema = schema.optional();
      }
      break;
    case "file":
      schema = z.any();
      if (f.required) {
        const requiredMessage =
          f.validation?.messages?.required || "Please select a file";
        schema = schema.refine(
          (val: any) => val !== undefined && val !== null,
          { message: requiredMessage },
        );
      } else {
        schema = schema.optional();
      }
      break;
    case "multi-file":
      const requiredMessage =
        f.validation?.messages?.required || "This field is required";
      schema = z.array(z.any()).refine(
        (files: any[]) => {
          if (!files || files.length === 0) return !f.required;
          return true;
        },
        { message: requiredMessage },
      );

      if (f.validation?.maxFiles) {
        const maxFilesMessage =
          f.validation.messages?.maxFiles ||
          `Maximum ${f.validation.maxFiles} files allowed`;
        schema = schema.refine(
          (files: any[]) => !files || files.length <= f.validation!.maxFiles!,
          { message: maxFilesMessage },
        );
      }

      if (f.validation?.maxFileSize) {
        const maxFileSizeMessage =
          f.validation.messages?.maxFileSize ||
          `File size must be less than ${Math.round(f.validation!.maxFileSize! / 1024 / 1024)}MB`;
        schema = schema.refine(
          (files: any[]) =>
            !files ||
            files.every(
              (file: File) => file.size <= f.validation!.maxFileSize!,
            ),
          {
            message: maxFileSizeMessage,
          },
        );
      }

      if (f.validation?.acceptedFileTypes) {
        const acceptedFileTypesMessage =
          f.validation.messages?.acceptedFileTypes ||
          `Only ${f.validation.acceptedFileTypes.join(", ")} files are allowed`;
        schema = schema.refine(
          (files: any[]) =>
            !files ||
            files.every((file: File) =>
              f.validation!.acceptedFileTypes!.includes(file.type),
            ),
          {
            message: acceptedFileTypesMessage,
          },
        );
      }

      if (!f.required) schema = schema.optional();
      break;
    case "array":
      if (!f.fields) {
        schema = z.array(z.any());
      } else {
        const inner = buildZodFromFields(f.fields);
        schema = z.array(z.object(inner));
      }
      if (f.required) {
        const requiredMessage =
          f.validation?.messages?.required || "This field is required";
        schema = schema.refine((val: any) => val && val.length > 0, {
          message: requiredMessage,
        });
      } else {
        schema = schema.optional();
      }
      break;
    default:
      schema = z.any().optional();
  }

  return schema;
};

const ErrorMsg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <p className="mt-1 text-sm text-red-600">{children}</p>
);

const FileUploadComponent: React.FC<{
  field: FieldDefinition;
  value: File[];
  onChange: (files: File[]) => void;
  errors?: any;
}> = ({ field, value = [], onChange, errors }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = useCallback(
    (file: File): string | null => {
      if (
        field.validation?.maxFileSize &&
        file.size > field.validation.maxFileSize
      ) {
        return (
          field.validation.messages?.maxFileSize ||
          `File size must be less than ${formatFileSize(field.validation.maxFileSize)}`
        );
      }
      if (
        field.validation?.acceptedFileTypes &&
        !field.validation.acceptedFileTypes.includes(file.type)
      ) {
        return (
          field.validation.messages?.acceptedFileTypes ||
          `File type ${file.type} is not allowed`
        );
      }
      return null;
    },
    [field.validation],
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      setUploadError(null);

      if (
        field.validation?.maxFiles &&
        value.length + fileArray.length > field.validation.maxFiles
      ) {
        const maxFilesMessage =
          field.validation.messages?.maxFiles ||
          `Maximum ${field.validation.maxFiles} files allowed`;
        setUploadError(maxFilesMessage);
        return;
      }

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setUploadError(error);
          return;
        }
      }

      onChange([...value, ...fileArray]);
    },
    [field.validation, value, onChange, validateFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (field.disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, field.disabled],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!field.disabled) setIsDragOver(true);
    },
    [field.disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles);
    },
    [value, onChange],
  );

  const openFileDialog = useCallback(() => {
    if (!field.disabled) {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      if (field.validation?.acceptedFileTypes) {
        input.accept = field.validation.acceptedFileTypes.join(",");
      }
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files) handleFiles(target.files);
      };
      input.click();
    }
  }, [field.disabled, field.validation?.acceptedFileTypes, handleFiles]);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{field.label}</Label>

      <Card
        className={`relative cursor-pointer border-2 border-dashed transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : field.disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-50"
              : "hover:border-primary hover:bg-primary/5 border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Upload className="mb-4 h-12 w-12 text-gray-400" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {isDragOver
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-gray-500">
              {field.validation?.acceptedFileTypes
                ? `Accepted types: ${field.validation.acceptedFileTypes.join(", ")}`
                : "Any file type"}
              {field.validation?.maxFileSize && (
                <span>
                  {" "}
                  • Max size: {formatFileSize(field.validation.maxFileSize)}
                </span>
              )}
              {field.validation?.maxFiles && (
                <span> • Max files: {field.validation.maxFiles}</span>
              )}
            </p>
          </div>
        </div>
      </Card>

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded files ({value.length})
          </p>
          <div className="space-y-2">
            {value.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg border bg-white p-3"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadError && <ErrorMsg>{uploadError}</ErrorMsg>}
      {errors && <ErrorMsg>{errors.message}</ErrorMsg>}
    </div>
  );
};

function FieldRenderer({ field, control, register, watch, errors }: any) {
  const visible = useMemo(() => {
    if (!field.visibleIf) return true;
    const v = watch(field.visibleIf.field);
    return v === field.visibleIf.value;
  }, [field, watch]);

  if (!visible) return null;

  const [asyncOptions, setAsyncOptions] = React.useState<Option[] | null>(null);
  React.useEffect(() => {
    let mounted = true;
    if (typeof field.options === "function") {
      field.options().then((res: Option[]) => {
        if (mounted) setAsyncOptions(res);
      });
    }
    return () => {
      mounted = false;
    };
  }, [field.options, field]);

  const options: Option[] =
    field.options && !Array.isArray(field.options)
      ? []
      : (field.options as Option[]) || [];

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "number":
      return (
        <div className="mb-4">
          <Label className="mb-2" htmlFor={field.key}>
            {field.label}
          </Label>
          <Input
            id={field.key}
            {...register(field.key)}
            placeholder={field.placeholder}
            type={field.type === "number" ? "number" : field.type}
            disabled={field.disabled}
            className="w-full"
            aria-invalid={!!errors?.[field.key]}
          />
          {errors?.[field.key] && (
            <ErrorMsg>{errors[field.key].message}</ErrorMsg>
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="mb-4">
          <Label className="mb-2" htmlFor={field.key}>
            {field.label}
          </Label>
          <Textarea
            id={field.key}
            {...register(field.key)}
            placeholder={field.placeholder}
            className="w-full"
          />
          {errors?.[field.key] && (
            <ErrorMsg>{errors[field.key].message}</ErrorMsg>
          )}
        </div>
      );

    case "select":
      return (
        <div className="mb-4">
          <Label className="mb-2" htmlFor={field.key}>
            {field.label}
          </Label>
          <Controller
            control={control}
            name={field.key}
            render={({ field: ctrlField }) => (
              <Select
                value={ctrlField.value}
                onValueChange={ctrlField.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {(asyncOptions || options).map((o) => (
                    <SelectItem key={String(o.value)} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors?.[field.key] && (
            <ErrorMsg>{errors[field.key].message}</ErrorMsg>
          )}
        </div>
      );

    case "radio":
      return (
        <div className="mb-4">
          <Label className="mb-2" htmlFor={field.key}>
            {field.label}
          </Label>
          <Controller
            control={control}
            name={field.key}
            render={({ field: ctrlField }) => (
              <RadioGroup
                value={ctrlField.value}
                onValueChange={ctrlField.onChange}
                className="flex gap-4"
              >
                {(asyncOptions || options).map((o) => (
                  <div
                    key={String(o.value)}
                    className="flex items-center gap-2"
                  >
                    <RadioGroupItem
                      value={String(o.value)}
                      id={`${field.key}-${o.value}`}
                    />
                    <Label htmlFor={`${field.key}-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors?.[field.key] && (
            <ErrorMsg>{errors[field.key].message}</ErrorMsg>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div className="mb-4">
          <Controller
            control={control}
            name={field.key}
            render={({ field: ctrlField }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={field.key}
                  checked={ctrlField.value}
                  onCheckedChange={ctrlField.onChange}
                />
                <Label htmlFor={field.key} className="text-sm">
                  {field.label}
                </Label>
              </div>
            )}
          />
          {errors?.[field.key] && (
            <ErrorMsg>{errors[field.key].message}</ErrorMsg>
          )}
        </div>
      );

    case "group":
      return (
        <fieldset className="mb-4 rounded border p-3">
          <legend className="mb-2 font-medium">{field.label}</legend>
          {field.fields?.map((f: FieldDefinition) => (
            <FieldRenderer
              key={f.key}
              field={f}
              control={control}
              register={register}
              watch={watch}
              errors={errors}
            />
          ))}
        </fieldset>
      );

    case "array": {
      const name = field.key;
      const { fields: arr, append, remove } = useFieldArray({ control, name });

      return (
        <div className="mb-4">
          <Label className="mb-2" htmlFor={field.key}>
            {field.label}
          </Label>
          <div className="space-y-3">
            {arr.map((a, i) => (
              <div key={a.id} className="rounded border p-3">
                {field.fields?.map((sub: FieldDefinition) => (
                  <FieldRenderer
                    key={`${name}.${i}.${sub.key}`}
                    field={{ ...sub, key: `${name}.${i}.${sub.key}` }}
                    control={control}
                    register={register}
                    watch={watch}
                    errors={errors?.[name]?.[i]}
                  />
                ))}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => remove(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append(
                  field.fields?.reduce(
                    (acc: any, f: FieldDefinition) => ({
                      ...acc,
                      [f.key]: f.default ?? "",
                    }),
                    {},
                  ) || {},
                )
              }
              className="mt-2 text-sm"
            >
              Add
            </button>
          </div>
        </div>
      );
    }

    case "file":
      return (
        <div className="mb-4">
          <Label className="mb-2" htmlFor={field.key}>
            {field.label}
          </Label>
          <input type="file" {...register(field.key)} />
          {errors?.[field.key] && (
            <ErrorMsg>{errors[field.key].message}</ErrorMsg>
          )}
        </div>
      );

    case "multi-file":
      return (
        <div className="mb-4">
          <Controller
            control={control}
            name={field.key}
            render={({ field: ctrlField }) => (
              <FileUploadComponent
                field={field}
                value={ctrlField.value || []}
                onChange={ctrlField.onChange}
                errors={errors?.[field.key]}
              />
            )}
          />
        </div>
      );

    default:
      return null;
  }
}

export default function DynamicForm({
  definition,
  onSubmit,
}: {
  definition: FormDefinition;
  onSubmit: (data: Record<string, unknown>) => Promise<void> | void;
}) {
  const zodSchema = useMemo(
    () => buildZodFromFields(definition.fields),
    [definition.fields],
  );

  const defaultValues = useMemo(
    () =>
      definition.fields.reduce(
        (acc: Record<string, unknown>, f) => ({
          ...acc,
          [f.key]: f.default ?? "",
        }),
        {},
      ),
    [definition.fields],
  );

  const { control, register, handleSubmit, watch, formState, reset } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  const { errors, isSubmitting, isDirty } = formState;
  const isLoading = definition.isLoading ?? isSubmitting;
  const isSubmitDisabled = isLoading || !isDirty;

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-1 max-w-2xl">
      {definition.title && (
        <h2 className="mb-4 text-xl font-bold">{definition.title}</h2>
      )}

      {definition.fields.map((f) => (
        <FieldRenderer
          key={f.key}
          field={f}
          control={control}
          register={register}
          watch={watch}
          errors={errors}
        />
      ))}

      <div className="mt-6 flex gap-3">
        <Button className="flex-1" disabled={isSubmitDisabled} asChild>
          <button type="submit">
            {isLoading
              ? "Submitting..."
              : definition.submitButtonText || "Submit"}
          </button>
        </Button>
        {definition.showResetButton && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
            disabled={isLoading || !isDirty}
            asChild
          >
            <button type="button">
              {definition.resetButtonText || "Reset"}
            </button>
          </Button>
        )}
      </div>
    </form>
  );
}
