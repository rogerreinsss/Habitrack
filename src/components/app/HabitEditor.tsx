"use client";

import { useState } from "react";
import { Modal } from "@/components/app/Modal";
import { useHabits } from "@/components/app/HabitProvider";
import { useToast } from "@/components/app/ToastProvider";
import { Icon } from "@/components/ui/Icon";
import {
  CATEGORIES,
  type Category,
  type Frequency,
  type Habit,
  type HabitDraft,
} from "@/lib/types";

const EMOJIS = [
  "🌟",
  "💧",
  "🏃",
  "📚",
  "🧘",
  "🍎",
  "💤",
  "✍️",
  "🎯",
  "🌱",
  "💊",
  "🎵",
  "🧠",
  "💪",
  "☕",
  "🚴",
] as const;

const FREQUENCIES: { value: Frequency; label: string; hint: string }[] = [
  { value: "daily", label: "Diario", hint: "Todos los días" },
  { value: "weekdays", label: "Lun–Vie", hint: "Días laborables" },
  { value: "weekend", label: "Fin de semana", hint: "Sábado y domingo" },
];

interface HabitEditorProps {
  habit: Habit | null;
  onClose: () => void;
}

export function HabitEditor({ habit, onClose }: HabitEditorProps) {
  const { saveHabit, archiveHabit } = useHabits();
  const { toast } = useToast();
  const [name, setName] = useState(habit?.name ?? "");
  const [desc, setDesc] = useState(habit?.desc ?? "");
  const [emoji, setEmoji] = useState(habit?.emoji ?? "🌟");
  const [cat, setCat] = useState<Category>(habit?.cat ?? "Salud");
  const [freq, setFreq] = useState<Frequency>(habit?.freq ?? "daily");
  const [tag, setTag] = useState(habit?.tag ?? "");
  const [error, setError] = useState("");

  const editing = habit !== null;
  const archived = habit?.archived ?? false;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Ponle un nombre para poder guardarlo.");
      return;
    }

    const draft: HabitDraft = {
      name: cleanName,
      desc: desc.trim(),
      cat,
      freq,
      tag: tag.trim().replace(/^#/, ""),
      emoji,
    };

    const saved = saveHabit(draft, habit?.id);
    if (!saved) {
      setError("No se pudo guardar. Revisa el nombre e inténtalo de nuevo.");
      return;
    }

    toast(editing ? "Hábito actualizado" : "Hábito creado", "success");
    onClose();
  }

  function handleArchive() {
    if (!habit) return;
    archiveHabit(habit.id, !archived);
    onClose();
  }

  return (
    <Modal
      onClose={onClose}
      labelledBy="habit-editor-title"
      className="modal-editor"
    >
      <header className="modal-header">
        <span className="modal-header-icon" aria-hidden="true">
          {emoji}
        </span>
        <div>
          <h2 className="modal-title" id="habit-editor-title">
            {editing ? "Editar hábito" : "Nuevo hábito"}
          </h2>
          <p className="modal-sub">
            {editing
              ? "Ajusta los detalles sin perder el historial."
              : "Empieza pequeño. Lo importante es volver."}
          </p>
        </div>
        <button
          type="button"
          className="icon-btn modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <Icon name="close" size={18} />
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="habit-name">
              Nombre <span aria-hidden="true">*</span>
            </label>
            <input
              id="habit-name"
              className="form-control"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError("");
              }}
              placeholder="Ej. Meditar 10 minutos"
              maxLength={60}
              autoComplete="off"
              data-autofocus
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "habit-name-error" : undefined}
            />
            {error && (
              <p className="form-error" id="habit-name-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="habit-desc">
              Descripción <span className="form-optional">opcional</span>
            </label>
            <textarea
              id="habit-desc"
              className="form-control"
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="¿Por qué quieres este hábito?"
              maxLength={200}
              rows={2}
            />
          </div>

          <fieldset className="form-group">
            <legend className="form-label">Icono</legend>
            <div className="emoji-grid">
              {EMOJIS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`emoji-opt ${emoji === option ? "is-selected" : ""}`}
                  onClick={() => setEmoji(option)}
                  aria-pressed={emoji === option}
                  aria-label={`Icono ${option}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-group">
            <legend className="form-label">Categoría</legend>
            <div className="cat-selector">
              {CATEGORIES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`cat-btn ${cat === option ? "is-selected" : ""}`}
                  onClick={() => setCat(option)}
                  aria-pressed={cat === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-group">
            <legend className="form-label">Frecuencia</legend>
            <div className="freq-options">
              {FREQUENCIES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`freq-btn ${freq === option.value ? "is-selected" : ""}`}
                  onClick={() => setFreq(option.value)}
                  aria-pressed={freq === option.value}
                >
                  <span className="freq-label">{option.label}</span>
                  <span className="freq-hint">{option.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="form-group">
            <label className="form-label" htmlFor="habit-tag">
              Etiqueta <span className="form-optional">opcional</span>
            </label>
            <input
              id="habit-tag"
              className="form-control"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              placeholder="mañana, salud…"
              maxLength={30}
              autoComplete="off"
            />
          </div>

          {editing && (
            <button
              type="button"
              className={`archive-action ${archived ? "is-restore" : ""}`}
              onClick={handleArchive}
            >
              <Icon name={archived ? "restore" : "archive"} size={16} />
              <span>{archived ? "Restaurar hábito" : "Archivar hábito"}</span>
            </button>
          )}
        </div>

        <footer className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {editing ? "Guardar cambios" : "Crear hábito"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
