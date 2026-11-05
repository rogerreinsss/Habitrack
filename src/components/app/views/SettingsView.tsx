"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useHabits } from "@/components/app/HabitProvider";
import { useToast } from "@/components/app/ToastProvider";
import { Toggle } from "@/components/app/Common";
import { Icon } from "@/components/ui/Icon";
import { activeHabits, todayProgress } from "@/lib/habits";
import { formatDateTime, plural } from "@/lib/date";
import { countRecords } from "@/lib/export";
import {
  MOTION_KEY,
  NOTIF_KEY,
  REMINDER_KEY,
  readPreference,
  removePreference,
  storageSizeKb,
  writePreference,
} from "@/lib/storage";

const DEFAULT_REMINDER = "09:00";

interface SettingsViewProps {
  onImport: () => void;
}

export function SettingsView({ onImport }: SettingsViewProps) {
  const { data, lastExport, storageError, exportAll, resetAll, syncStatus } =
    useHabits();
  const { user, configured, signOut } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(false);
  const [reminder, setReminder] = useState(DEFAULT_REMINDER);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    const savedReminder = readPreference(REMINDER_KEY);
    if (savedReminder && /^\d{2}:\d{2}$/.test(savedReminder)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- preferences hydrate from localStorage after mount
      setReminder(savedReminder);
    }

    const notifStored = readPreference(NOTIF_KEY) === "1";
    const permissionGranted =
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted";
    setNotifications(notifStored && permissionGranted);

    setReducedMotion(readPreference(MOTION_KEY) === "1");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? "reduced" : "full";
  }, [reducedMotion]);

  useEffect(() => {
    if (!resetArmed) return;
    const timer = window.setTimeout(() => setResetArmed(false), 6000);
    return () => window.clearTimeout(timer);
  }, [resetArmed]);

  // Local notifications only: no server, no push service.
  useEffect(() => {
    if (!notifications) return;
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    let timer = 0;

    const schedule = () => {
      const [hours, minutes] = reminder.split(":").map(Number);
      const next = new Date();
      next.setHours(hours ?? 9, minutes ?? 0, 0, 0);
      if (next.getTime() <= Date.now()) {
        next.setDate(next.getDate() + 1);
      }

      timer = window.setTimeout(() => {
        const progress = todayProgress(data);
        new Notification("Motiveva · Tu mejor versión", {
          body: `${progress.completed}/${progress.scheduled} hábitos completados hoy.`,
          icon: "/icon.svg",
          tag: "motiveva-daily",
        });
        schedule();
      }, Math.max(1000, next.getTime() - Date.now()));
    };

    schedule();
    return () => window.clearTimeout(timer);
  }, [notifications, reminder, data]);

  async function handleNotificationToggle(next: boolean) {
    if (!next) {
      setNotifications(false);
      removePreference(NOTIF_KEY);
      toast("Recordatorios desactivados", "info");
      return;
    }

    if (!("Notification" in window)) {
      toast("Este navegador no admite notificaciones", "error");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast("Permiso de notificaciones denegado", "warning");
        return;
      }
    } catch {
      toast("No se pudo activar el recordatorio", "error");
      return;
    }

    writePreference(NOTIF_KEY, "1");
    setNotifications(true);
    toast("Recordatorio diario activado", "success");
  }

  function changeReminder(value: string) {
    setReminder(value);
    writePreference(REMINDER_KEY, value);
  }

  function toggleMotion(next: boolean) {
    setReducedMotion(next);
    writePreference(MOTION_KEY, next ? "1" : "0");
  }

  const active = activeHabits(data);
  const archivedCount = data.habits.length - active.length;
  const sizeKb = storageSizeKb(data).toFixed(1);
  const records = countRecords(data);
  const syncLabel = !user
    ? "Solo en este dispositivo"
    : syncStatus === "synced"
      ? "Sincronizado en la nube"
      : syncStatus === "syncing"
        ? "Sincronizando cambios…"
        : syncStatus === "error"
          ? "No se pudo sincronizar. Tus datos siguen en este dispositivo."
          : "Cuenta conectada";

  return (
    <div className="view settings-view">
      <h1 className="sr-only">Ajustes</h1>

      {storageError && (
        <div className="alert-banner" role="alert">
          <Icon name="alert" size={16} />
          <span>
            No se pudo guardar en este navegador. Puede que el almacenamiento
            esté lleno o bloqueado. Exporta una copia de tus datos.
          </span>
        </div>
      )}

      <section className="settings-card">
        <div className="settings-head">
          <span className="panel-icon">
            <Icon name="globe" size={16} />
          </span>
          <h2 className="settings-title">Cuenta y sincronización</h2>
        </div>

        {!configured ? (
          <div className="settings-row">
            <div className="settings-copy">
              <span className="s-label">Sincronización no disponible</span>
              <span className="s-sub">
                La autenticación no está configurada en este entorno. Motiveva
                sigue funcionando en local.
              </span>
            </div>
          </div>
        ) : user ? (
          <>
            <div className="settings-row">
              <div className="settings-copy">
                <span className="s-label">{user.email}</span>
                <span className="s-sub">{syncLabel}</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => void signOut()}
              >
                Cerrar sesión
              </button>
            </div>

            <div className="settings-row">
              <div className="settings-copy">
                <span className="s-label">Copia en la nube</span>
                <span className="s-sub">
                  Tus cambios se guardan en tu cuenta privada y se cargan al
                  iniciar sesión en otro dispositivo.
                </span>
              </div>
              <span
                className={`status-dot ${syncStatus === "error" ? "is-error" : ""}`}
                title={syncLabel}
              />
            </div>
          </>
        ) : (
          <div className="settings-row">
            <div className="settings-copy">
              <span className="s-label">Sincroniza entre dispositivos</span>
              <span className="s-sub">
                Crea una cuenta o inicia sesión. Sin cuenta, Motiveva sigue
                funcionando solo en este navegador.
              </span>
            </div>
            <Link href="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
          </div>
        )}
      </section>

      <section className="settings-card">
        <div className="settings-head">
          <span className="panel-icon">
            <Icon name="bell" size={16} />
          </span>
          <h2 className="settings-title">Recordatorios</h2>
        </div>

        <div className="settings-row">
          <div className="settings-copy">
            <span className="s-label">Recordatorio diario</span>
            <span className="s-sub">
              Notificación local del navegador. Nada se envía a un servidor.
            </span>
          </div>
          <Toggle
            checked={notifications}
            onChange={handleNotificationToggle}
            label="Activar recordatorio diario"
          />
        </div>

        <div className="settings-row">
          <div className="settings-copy">
            <span className="s-label">Hora del recordatorio</span>
            <span className="s-sub">
              {notifications
                ? "Te avisaremos a esta hora, en tu zona horaria."
                : "Activa el recordatorio para elegir la hora."}
            </span>
          </div>
          <input
            type="time"
            className="form-control time-input"
            value={reminder}
            disabled={!notifications}
            onChange={(event) => changeReminder(event.target.value)}
            aria-label="Hora del recordatorio"
          />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-head">
          <span className="panel-icon">
            <Icon name="eyeOff" size={16} />
          </span>
          <h2 className="settings-title">Accesibilidad</h2>
        </div>

        <div className="settings-row">
          <div className="settings-copy">
            <span className="s-label">Reducir movimiento</span>
            <span className="s-sub">
              Desactiva las transiciones y el pulso de la interfaz.
            </span>
          </div>
          <Toggle
            checked={reducedMotion}
            onChange={toggleMotion}
            label="Reducir movimiento"
          />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-head">
          <span className="panel-icon">
            <Icon name="database" size={16} />
          </span>
          <h2 className="settings-title">Tus datos</h2>
        </div>

        <div className="settings-row">
          <div className="settings-copy">
            <span className="s-label">Exportar datos</span>
            <span className="s-sub">Descarga una copia completa en JSON.</span>
          </div>
          <button type="button" className="btn btn-ghost" onClick={exportAll}>
            <Icon name="download" size={15} />
            Exportar
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-copy">
            <span className="s-label">Importar datos</span>
            <span className="s-sub">
              Restaura una copia o combínala con lo que ya tienes.
            </span>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onImport}>
            <Icon name="upload" size={15} />
            Importar
          </button>
        </div>

        <div className="settings-row settings-row-reset">
          <div className="settings-copy">
            <span className="s-label">Resetear todo</span>
            <span className="s-sub">
              {user
                ? "Elimina hábitos, historial y preferencias de este dispositivo y de tu cuenta."
                : "Elimina hábitos, historial y preferencias de este dispositivo."}
            </span>
          </div>

          {resetArmed ? (
            <div className="reset-confirm">
              <span>¿Borrar todo?</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setResetArmed(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setResetArmed(false);
                  resetAll();
                }}
              >
                Sí, borrar
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-danger-soft"
              onClick={() => setResetArmed(true)}
            >
              <Icon name="trash" size={15} />
              Resetear
            </button>
          )}
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-head">
          <span className="panel-icon">
            <Icon name="device" size={16} />
          </span>
          <h2 className="settings-title">Almacenamiento</h2>
        </div>

        <div className="settings-row">
          <div className="settings-copy">
            <span className="s-label">Uso local</span>
            <span className="s-sub">
              {sizeKb} KB · {plural(active.length, "activo", "activos")}
              {archivedCount > 0
                ? ` · ${plural(archivedCount, "archivado", "archivados")}`
                : ""}{" "}
              · {plural(records, "registro", "registros")}
            </span>
          </div>
          <span className="status-dot" title="Guardado en este dispositivo" />
        </div>

        <div className="settings-row">
          <div className="settings-copy">
            <span className="s-label">Última exportación</span>
            <span className="s-sub">
              {lastExport ? formatDateTime(lastExport) : "Nunca"}
            </span>
          </div>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-head">
          <span className="panel-icon">
            <Icon name="keyboard" size={16} />
          </span>
          <h2 className="settings-title">Atajos de teclado</h2>
        </div>

        <div className="settings-row settings-row-shortcuts">
          <div className="kbd-list">
            <span>
              <kbd>Ctrl</kbd>
              <kbd>K</kbd> Buscar
            </span>
            <span>
              <kbd>N</kbd> Nuevo
            </span>
            <span>
              <kbd>T</kbd> Hoy
            </span>
            <span>
              <kbd>H</kbd> Hábitos
            </span>
            <span>
              <kbd>S</kbd> Estadísticas
            </span>
            <span>
              <kbd>,</kbd> Ajustes
            </span>
          </div>
        </div>
      </section>

      <section className="settings-card settings-privacy">
        <span className="settings-privacy-icon">
          <Icon name="shield" size={18} />
        </span>
        <div>
          <h2 className="s-label">Privacidad por diseño</h2>
          <p className="s-sub">
            Sin cuenta, todo se guarda en el almacenamiento local de tu
            navegador. Si inicias sesión, tus hábitos se guardan en una copia
            privada para sincronizarlos entre dispositivos. No hay cookies de
            seguimiento ni publicidad.{" "}
            <Link href="/privacidad" className="text-link">
              Leer la política de privacidad
              <Icon name="arrowUpRight" size={13} />
            </Link>
          </p>
          <p className="s-sub settings-version">
            Motiveva · versión 1.0 · local-first con cuenta opcional
          </p>
        </div>
      </section>
    </div>
  );
}
