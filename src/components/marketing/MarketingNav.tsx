"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { APP_PATH, NAV_LINKS } from "@/lib/site";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="marketing-nav-wrap">
      <nav className="nav-pill" aria-label="Navegación principal">
        <Brand href="/" subtitle={false} />

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={`/${link.href}`} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link href={APP_PATH} className="btn btn-ghost btn-sm">
            Abrir app
          </Link>
          <Link href={APP_PATH} className="btn btn-primary btn-sm">
            Empezar gratis
          </Link>
        </div>

        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
      </nav>

      {open && (
        <div className="nav-mobile-panel" id="mobile-nav-panel">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              className="nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
              <Icon name="chevronRight" size={16} />
            </Link>
          ))}
          <div className="nav-mobile-actions">
            <Link
              href={APP_PATH}
              className="btn btn-ghost"
              onClick={() => setOpen(false)}
            >
              Abrir app
            </Link>
            <Link
              href={APP_PATH}
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
