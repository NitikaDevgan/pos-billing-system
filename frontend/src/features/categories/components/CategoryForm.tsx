import { useState, type FormEvent } from "react";
import { Button } from "../../../components/Button/Button";
import { Input } from "../../../components/Input/Input";
import type { Category, CategoryInput } from "../types";

interface CategoryFormProps {
  initialCategory?: Category;
  isSubmitting: boolean;
  onSubmit: (input: CategoryInput) => void;
  onCancel: () => void;
}

export function CategoryForm({
  initialCategory,
  isSubmitting,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(initialCategory?.name ?? "");
  const [isActive, setIsActive] = useState(initialCategory?.isActive ?? true);
  const [error, setError] = useState<string>();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return setError("Category name is required.");
    onSubmit({ name: trimmedName, isActive });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Name"
        value={name}
        error={error}
        autoFocus
        maxLength={50}
        onChange={(event) => {
          setName(event.target.value);
          setError(undefined);
        }}
      />
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Active
      </label>
      <div className="admin-form__actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
