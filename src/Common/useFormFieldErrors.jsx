import { useState, useCallback } from "react";

/**
 * useFormFieldErrors
 * --------------------------------------------------------------------------
 * Reusable hook for showing backend field-level validation errors inline
 * under form fields (via MUI TextField's `error` / `helperText` props),
 * instead of a generic toast.
 *
 * Works with any form. Pass the list of field names your form has, and it
 * gives you back an errors object + helpers to clear/apply/read them.
 *
 * Backend error shapes supported out of the box (checked in this order):
 *   1. error.errors                  -> your AxiosInstance.js interceptor's
 *                                        { type: "VALIDATION", errors: [...] }
 *   2. error.response.data.details   -> raw axios error, Spring-style body
 *   3. error.data.details
 *   4. error.details
 *
 * Each entry in that array can be:
 *   - A string like "fieldName: message" (e.g. "venue: Venue is required")
 *   - An object like { field: "venue", message: "Venue is required" }
 *
 * --------------------------------------------------------------------------
 * USAGE
 *
 *   const fieldNames = ["eventTitle", "startDate", "endDate", "venue"];
 *   const {
 *     formErrors,
 *     clearFieldErrors,
 *     applyBackendFieldErrors,
 *     fieldProps,
 *   } = useFormFieldErrors(fieldNames);
 *
 *   const handleCreate = async () => {
 *     clearFieldErrors();
 *     setLoading(true);
 *     try {
 *       await instance.post("/events", payload);
 *       ...
 *     } catch (error) {
 *       const handled = applyBackendFieldErrors(error);
 *       if (!handled) {
 *         toast.error("❌ " + (error?.response?.data?.message || error?.message || "Failed"));
 *       }
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *
 *   <TextField name="venue" {...fieldProps("venue")} ... />
 *   // fieldProps("venue") === { error: true, helperText: "Venue is required" }
 * --------------------------------------------------------------------------
 */
export default function useFormFieldErrors(fieldNames = []) {
  const emptyErrors = fieldNames.reduce((acc, name) => {
    acc[name] = "";
    return acc;
  }, {});

  const [formErrors, setFormErrors] = useState(emptyErrors);

  // Reset every tracked field's error back to "".
  const clearFieldErrors = useCallback(() => {
    setFormErrors(fieldNames.reduce((acc, name) => {
      acc[name] = "";
      return acc;
    }, {}));
  }, [fieldNames]);

  // Clear a single field's error, e.g. call this from onChange.
  const clearFieldError = useCallback((name) => {
    setFormErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  // Manually set one or more field errors (e.g. for frontend checks).
  const setFieldErrors = useCallback((errorsObj) => {
    setFormErrors((prev) => ({ ...prev, ...errorsObj }));
  }, []);

  // Parse a caught error object (from axios / interceptor) and apply any
  // field-level errors onto formErrors.
  // Returns true if it found & applied at least one field-level error,
  // so the caller knows to skip its generic fallback toast.
  const applyBackendFieldErrors = useCallback((error) => {
    // Try to get the errors array from various possible locations
    const errorsArray =
      error?.errors ||
      error?.response?.data?.errors ||
      error?.data?.errors ||
      error?.details ||
      error?.response?.data?.details ||
      error?.data?.details ||
      null;

    if (!Array.isArray(errorsArray) || errorsArray.length === 0) return false;

    const parsed = {};
    errorsArray.forEach((detail) => {
      // Handle object format: { field: "venue", message: "Venue is required" }
      if (typeof detail === "object" && detail !== null) {
        const field = detail.field || detail.fieldName || detail.property;
        const message = detail.message || detail.error || detail.defaultMessage;
        if (field && message && fieldNames.includes(field)) {
          parsed[field] = message;
        }
      }
      // Handle string format: "fieldName: message"
      else if (typeof detail === "string" && detail.includes(":")) {
        const [field, ...rest] = detail.split(":");
        const key = field.trim();
        const message = rest.join(":").trim();
        if (fieldNames.includes(key)) {
          parsed[key] = message;
        }
      }
      // Handle string format without colon (assume it's a general error)
      else if (typeof detail === "string") {
        // Try to match pattern like "fieldName message" or "fieldName - message"
        const match = detail.match(/^(\w+)\s*[-:]\s*(.+)$/);
        if (match) {
          const key = match[1].trim();
          const message = match[2].trim();
          if (fieldNames.includes(key)) {
            parsed[key] = message;
          }
        }
      }
    });

    if (Object.keys(parsed).length === 0) return false;

    setFormErrors((prev) => ({ ...prev, ...parsed }));
    return true;
  }, [fieldNames]);

  // Spread this directly onto a TextField: <TextField {...fieldProps("venue")} />
  const fieldProps = useCallback((name) => ({
    error: !!formErrors[name],
    helperText: formErrors[name],
  }), [formErrors]);

  return {
    formErrors,
    setFormErrors,
    clearFieldErrors,
    clearFieldError,
    setFieldErrors,
    applyBackendFieldErrors,
    fieldProps,
  };
}