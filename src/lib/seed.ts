import type { Habit } from "./types";
import { todayKey } from "./date";

/**
 * First-run sample habits. They exist only on the user's device and can be
 * deleted at any time, so new visitors can try the app immediately.
 */
export function createSeedHabits(): Habit[] {
  const created = todayKey();
  return [
    {
      id: "seed-water",
      name: "Beber 2L de agua",
      desc: "Mantenerme bien hidratado todo el día",
      cat: "Salud",
      freq: "daily",
      tag: "salud",
      emoji: "💧",
      created,
      archived: false,
    },
    {
      id: "seed-meditate",
      name: "Meditar 10 min",
      desc: "Reducir el estrés y mejorar el enfoque",
      cat: "Mente",
      freq: "daily",
      tag: "mindfulness",
      emoji: "🧘",
      created,
      archived: false,
    },
    {
      id: "seed-exercise",
      name: "Ejercicio 30 min",
      desc: "Cardio o fuerza, mantenerme activo",
      cat: "Fitness",
      freq: "weekdays",
      tag: "gym",
      emoji: "🏃",
      created,
      archived: false,
    },
    {
      id: "seed-read",
      name: "Leer 20 páginas",
      desc: "Un libro al mes como mínimo",
      cat: "Mente",
      freq: "daily",
      tag: "lectura",
      emoji: "📚",
      created,
      archived: false,
    },
  ];
}
