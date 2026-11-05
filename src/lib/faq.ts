export const FAQ_ITEMS = [
  {
    question: "¿Motiveva es gratis?",
    answer:
      "Sí. Todas las funciones están disponibles sin coste y sin límite de hábitos. No hay plan premium, anuncios ni compras dentro de la app.",
  },
  {
    question: "¿Necesito crear una cuenta?",
    answer:
      "No. Puedes abrir Motiveva y empezar sin registro. La cuenta es opcional: sirve para guardar una copia privada y sincronizar tus hábitos entre dispositivos.",
  },
  {
    question: "¿Dónde se guardan mis hábitos?",
    answer:
      "Sin cuenta, en el almacenamiento local de tu navegador (localStorage). Si creas una cuenta, se guarda además una copia privada en Supabase para que puedas recuperarla en otro dispositivo. Solo tú puedes leerla.",
  },
  {
    question: "¿Puedo pasar mis datos a otro dispositivo?",
    answer:
      "Sí. Puedes exportar una copia completa en JSON desde Ajustes e importarla en el otro dispositivo, o iniciar sesión con tu cuenta para que se carguen automáticamente.",
  },
  {
    question: "¿Qué pasa si borro los datos del navegador?",
    answer:
      "Sin cuenta se eliminan tus hábitos e historial locales. Con cuenta, al volver a iniciar sesión se descarga la copia guardada en la nube. Aun así, exportar una copia de seguridad de vez en cuando es buena idea.",
  },
  {
    question: "¿Usa cookies, analítica o anuncios?",
    answer:
      "No hay cookies de seguimiento, píxeles, analítica de terceros ni publicidad. La cuenta opcional usa Supabase para autenticación y almacenamiento, y el sitio se aloja en Vercel.",
  },
  {
    question: "¿Cómo funcionan los recordatorios?",
    answer:
      "Son notificaciones locales del navegador. Solo se activan si tú das permiso desde Ajustes y puedes desactivarlas en cualquier momento.",
  },
  {
    question: "¿Funciona sin conexión?",
    answer:
      "El modo sin cuenta funciona sin conexión una vez cargada la app. La sincronización con tu cuenta necesita red; si falla, tus cambios siguen guardados en el dispositivo y puedes reintentar al volver a conectar.",
  },
] as const;
