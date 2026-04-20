import { useCallback, useState } from "react";
import { createResource, uploadResourceFile } from "../services/resourceService";

export function useSubmitResource() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submitResource = useCallback(async (formData, file, user) => {
    try {
      setSubmitting(true);
      setError("");

      const payload = { ...formData };

      if (file) {
        const uploadResult = await uploadResourceFile(file, user.uid);
        payload.fileUrl = uploadResult.fileUrl;
        payload.storagePath = uploadResult.storagePath;
      }

      const id = await createResource(payload, user);
      return id;
    } catch (submitError) {
      setError(submitError.message || "Failed to submit resource");
      throw submitError;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    submitResource,
    submitting,
    error,
  };
}
