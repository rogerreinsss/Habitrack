"use client";

import { Modal } from "@/components/app/Modal";
import { Icon } from "@/components/ui/Icon";
import { countRecords } from "@/lib/export";
import { plural } from "@/lib/date";
import type { ImportedData, ImportMode } from "@/lib/types";

interface ImportModalProps {
  imported: ImportedData;
  onApply: (mode: ImportMode) => void;
  onClose: () => void;
}

export function ImportModal({ imported, onApply, onClose }: ImportModalProps) {
  const records = countRecords(imported);

  return (
    <Modal onClose={onClose} labelledBy="import-title" className="modal-import">
      <header className="modal-header">
        <span className="modal-header-icon" aria-hidden="true">
          <Icon name="upload" size={18} />
        </span>
        <div>
          <h2 className="modal-title" id="import-title">
            Importar datos
          </h2>
          <p className="modal-sub">Revisa el archivo antes de continuar.</p>
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

      <div className="modal-body">
        <div className="import-summary">
          <span className="import-icon" aria-hidden="true">
            <Icon name="database" size={20} />
          </span>
          <div className="import-summary-copy">
            <span className="import-name">{imported.fileName}</span>
            <span className="import-meta">
              {plural(imported.habits.length, "hábito", "hábitos")} ·{" "}
              {plural(records, "registro", "registros")}
            </span>
          </div>
          <span className="import-valid">
            <Icon name="check" size={13} />
            Verificado
          </span>
        </div>

        <div className="import-options">
          <div className="import-option">
            <span className="import-option-icon">
              <Icon name="plus" size={15} />
            </span>
            <div>
              <span className="import-option-title">Combinar</span>
              <p className="import-option-text">
                Conserva tus hábitos actuales y añade los del archivo. Si un
                hábito coincide, se actualiza su información.
              </p>
            </div>
          </div>
          <div className="import-option">
            <span className="import-option-icon">
              <Icon name="refresh" size={15} />
            </span>
            <div>
              <span className="import-option-title">Reemplazar</span>
              <p className="import-option-text">
                Sustituye todos tus datos actuales por los del archivo. Podrás
                deshacerlo justo después.
              </p>
            </div>
          </div>
        </div>

        <p className="import-note">
          El archivo se procesa en tu dispositivo. Nada se sube a ningún
          servidor.
        </p>
      </div>

      <footer className="modal-footer">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => onApply("merge")}
        >
          Combinar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onApply("replace")}
        >
          Reemplazar
        </button>
      </footer>
    </Modal>
  );
}
