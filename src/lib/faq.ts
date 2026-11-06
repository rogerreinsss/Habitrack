export const FAQ_ITEMS = [
  {
    question: "¿Motiveva es gratis?",
    answer:
      "Sí. Todas las funciones están disponibles sin coste y sin límite de hábitos. No hay plan premium, anuncios ni compras dentro de la app.",
  },
  {
    question: "¿Necesito crear una cuenta?",
    answer:
      "Sí. La cuenta guarda tu espacio privado y permite que tus hábitos te acompañen entre dispositivos. Se crea con un email, una contraseña y un código de verificación que enviamos a tu correo.",
  },
  {
    question: "¿Dónde se guardan mis hábitos?",
    answer:
      "En una copia privada en Supabase, asociada únicamente a tu cuenta y protegida con Row Level Security: solo tú puedes leerla y escribirla. Tu navegador guarda además una copia de trabajo para que la app funcione aunque falle la conexión.",
  },
  {
    question: "¿Puedo pasar mis datos a otro dispositivo?",
    answer:
      "Sí. Inicia sesión con tu cuenta en el otro dispositivo y se descargará automáticamente tu copia. También puedes exportar una copia completa en JSON desde Ajustes e importarla donde quieras.",
  },
  {
    question: "¿Qué pasa si olvido mi contraseña?",
    answer:
      "Desde la pantalla de acceso puedes pedir un enlace de recuperación a tu email, que te lleva a una página segura para crear una contraseña nueva. Al cambiarla se cierran todas tus otras sesiones por seguridad.",
  },
  {
    question: "¿Qué pasa si borro los datos del navegador?",
    answer:
      "Se elimina la copia de trabajo local, pero al volver a iniciar sesión se descarga la copia guardada en la nube. Aun así, exportar una copia de seguridad de vez en cuando es buena idea.",
  },
  {
    question: "¿Usa cookies, analítica o anuncios?",
    answer:
      "No hay cookies de seguimiento, píxeles, analítica de terceros ni publicidad. Solo el almacenamiento técnico de la sesión (con account en Supabase) y de los datos de la app. El sitio se aloja en Vercel.",
  },
  {
    question: "¿Cómo funcionan los recordatorios?",
    answer:
      "Son notificaciones locales del navegador. Solo se activan si tú das permiso desde Ajustes y puedes desactivarlas en cualquier momento.",
  },
  {
    question: "¿Funciona sin conexión?",
    answer:
      "Una vez cargada la app, sí: la copia de trabajo está en tu navegador. La sincronización con tu cuenta necesita red; si falla, tus cambios siguen guardados en el dispositivo y se subirán al volver a conectar.",
  },
  {
    question: "¿Cómo borro mi cuenta?",
    answer:
      "Desde Ajustes puedes vaciar tus datos (hábitos, historial y copia en la nube). Para eliminar la cuenta por completo, escribe a nuestro email de contacto y la borraremos junto con su copia.",
  },
] as const;
