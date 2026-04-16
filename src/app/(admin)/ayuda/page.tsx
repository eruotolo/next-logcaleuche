import type { Metadata } from 'next';

import { BookOpen, Calendar, DollarSign, FileText, HelpCircle, Home } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Ayuda | Intranet Caleuche 250',
    description: 'Preguntas frecuentes y guía de uso de la intranet',
};

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    items: FaqItem[];
}

const faqSections: FaqSection[] = [
    {
        id: 'navegacion',
        title: 'Navegación',
        icon: <Home className="h-4 w-4" />,
        items: [
            {
                question: '¿Cómo navegar entre secciones?',
                answer:
                    'Usa el menú lateral (Sidebar) ubicado a la izquierda de la pantalla. Cada sección está organizada por categorías: Menú principal, Elementos por grado y Sistema (solo SuperAdmin). En móvil, toca el ícono de menú en la barra superior para abrir el menú lateral.',
            },
            {
                question: '¿Qué es el Sidebar?',
                answer:
                    'El Sidebar es el menú de navegación lateral. Contiene accesos directos a todas las secciones disponibles según tu grado iniciático y rol en la logia. En escritorio puedes colapsarlo usando el botón de la barra superior para ganar más espacio.',
            },
            {
                question: '¿Por qué no veo algunas secciones?',
                answer:
                    'El acceso a ciertas secciones depende de tu grado iniciático y tu rol. Por ejemplo, los documentos de Compañero solo son visibles a partir del 2° Grado, y la Tesorería es exclusiva del Tesorero y los Administradores.',
            },
        ],
    },
    {
        id: 'feed',
        title: 'Feed y Noticias',
        icon: <FileText className="h-4 w-4" />,
        items: [
            {
                question: '¿Cómo crear un post en el Feed?',
                answer:
                    'Desde la sección "Noticias" en el menú lateral, haz clic en el botón "Nuevo Post". Completa el título, selecciona una categoría, escribe el contenido y opcionalmente adjunta un archivo. Todos los hermanos autenticados pueden publicar.',
            },
            {
                question: '¿Cómo comentar en un post?',
                answer:
                    'Abre el post que deseas comentar haciendo clic en su título. Al final del contenido encontrarás el campo de comentarios. Escribe tu mensaje y presiona "Comentar". Los comentarios son visibles para todos los hermanos.',
            },
            {
                question: '¿Cómo adjuntar archivos a un post?',
                answer:
                    'Al crear un nuevo post, encontrarás un campo de archivo opcional. Puedes adjuntar documentos PDF o imágenes. El archivo se almacena de forma segura en la nube y estará disponible para descarga desde el post.',
            },
        ],
    },
    {
        id: 'eventos',
        title: 'Calendario y Eventos',
        icon: <Calendar className="h-4 w-4" />,
        items: [
            {
                question: '¿Cómo ver los eventos del calendario?',
                answer:
                    'Dirígete a la sección "Calendario" en el menú lateral. Verás la lista de próximos eventos con fecha, hora de inicio y término. Los eventos están filtrados según tu grado: solo verás los que corresponden a tu grado iniciático o inferior.',
            },
            {
                question: '¿Cómo confirmar asistencia a un evento?',
                answer:
                    'Actualmente la confirmación de asistencia se realiza a través del canal oficial de comunicación de la logia. El calendario es de consulta y no incluye confirmación en línea en esta versión.',
            },
            {
                question: '¿Cómo se crean nuevos eventos?',
                answer:
                    'Solo los Administradores pueden crear nuevos eventos. Si necesitas agregar un evento al calendario, comunícate con el Secretario o un Administrador del sistema.',
            },
        ],
    },
    {
        id: 'documentos',
        title: 'Documentos',
        icon: <BookOpen className="h-4 w-4" />,
        items: [
            {
                question: '¿Cómo acceder a la biblioteca?',
                answer:
                    'En el menú lateral, bajo la sección "Elementos", encontrarás las subsecciones por grado (Aprendiz, Compañero, Maestro). Cada una tiene su biblioteca. Solo verás las bibliotecas correspondientes a tu grado o inferior.',
            },
            {
                question: '¿Cómo descargar un documento?',
                answer:
                    'Dentro de cada sección (Biblioteca, Actas, Trazados, Boletines), haz clic en el nombre del documento o en el ícono de descarga. El archivo se abrirá o descargará directamente desde la nube.',
            },
            {
                question: '¿Qué diferencia hay entre Actas, Biblioteca, Boletines y Trazados?',
                answer:
                    'Actas: registros oficiales de las tenidas. Biblioteca: libros y material de estudio. Boletines: publicaciones periódicas de la logia. Trazados: trabajos de arquitectura presentados en tenida por los hermanos.',
            },
        ],
    },
    {
        id: 'tesoreria',
        title: 'Tesorería',
        icon: <DollarSign className="h-4 w-4" />,
        items: [
            {
                question: '¿Cómo ver el estado financiero?',
                answer:
                    'La sección "Tesorería" está disponible exclusivamente para el Tesorero y los Administradores. Desde allí puedes revisar Ingresos, Egresos y el Informe consolidado con el balance por mes y año.',
            },
            {
                question: '¿Cómo registrar un ingreso o egreso?',
                answer:
                    'Dentro de Tesorería, selecciona "Ingresos" o "Egresos" y haz clic en el botón "Nuevo". Completa el formulario con el hermano, monto, motivo, mes y año correspondiente.',
            },
            {
                question: '¿Puedo ver mi estado de cuotas?',
                answer:
                    'Sí. En la sección de tu perfil de usuario podrás ver el detalle de tus pagos de cuotas. Solo el Tesorero y Administradores tienen acceso completo al resumen general.',
            },
        ],
    },
];

export default function AyudaPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6 py-2">
            {/* Header */}
            <div
                className="rounded-xl border border-white/[0.08] p-6"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(90,103,216,0.18)]">
                        <HelpCircle className="h-5 w-5 text-[#9ea7ff]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-[#e7e6fc]">Centro de Ayuda</h1>
                        <p className="text-sm text-[#9a9ab0]">
                            Preguntas frecuentes sobre el uso de la intranet
                        </p>
                    </div>
                </div>
            </div>

            {/* Secciones de FAQ */}
            {faqSections.map((section) => (
                <div
                    key={section.id}
                    className="rounded-xl border border-white/[0.08] overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
                >
                    {/* Encabezado de sección */}
                    <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
                        <span className="text-[#9ea7ff]">{section.icon}</span>
                        <h2 className="text-sm font-semibold tracking-wide text-[#e7e6fc]">
                            {section.title}
                        </h2>
                    </div>

                    {/* Items del acordeón */}
                    <div className="divide-y divide-white/[0.04]">
                        {section.items.map((item) => (
                            <details
                                key={item.question}
                                className="group px-5 py-0"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium text-[#c4c3d8] transition-colors hover:text-[#e7e6fc]">
                                    <span>{item.question}</span>
                                    {/* Chevron animado con CSS group-open */}
                                    <svg
                                        className="h-4 w-4 shrink-0 text-[#9a9ab0] transition-transform duration-200 group-open:rotate-180"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <p className="pb-4 text-sm leading-relaxed text-[#9a9ab0]">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            ))}

            {/* Footer de contacto */}
            <div
                className="rounded-xl border border-white/[0.08] px-5 py-4 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}
            >
                <p className="text-sm text-[#9a9ab0]">
                    ¿No encontraste lo que buscabas?{' '}
                    <span className="text-[#9ea7ff]">
                        Comunícate con el Administrador del sistema.
                    </span>
                </p>
            </div>
        </div>
    );
}
