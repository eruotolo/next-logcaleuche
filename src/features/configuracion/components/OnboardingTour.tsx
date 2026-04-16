'use client';

import { useState } from 'react';

import { markOnboardingSeen } from '../actions';

interface OnboardingTourProps {
    hasSeenOnboarding: boolean;
    userName: string;
}

interface TourStep {
    title: string;
    description: string;
}

const STEPS: TourStep[] = [
    {
        title: 'Bienvenido a la intranet',
        description:
            'Este es tu panel principal. Aquí encontrarás toda la información de la logia.',
    },
    {
        title: 'Navegación',
        description:
            'Usa el menú lateral para acceder a las diferentes secciones según tu grado.',
    },
    {
        title: 'Feed',
        description:
            'Publica y comenta noticias y circulares de la logia en la sección Feed.',
    },
    {
        title: 'Calendario',
        description:
            'Revisa los próximos eventos y confirma tu asistencia en la sección Eventos.',
    },
    {
        title: 'Documentos',
        description:
            'Accede a la biblioteca, actas y trazados según tu grado iniciático.',
    },
];

export function OnboardingTour({ hasSeenOnboarding, userName }: OnboardingTourProps) {
    const [visible, setVisible] = useState(!hasSeenOnboarding);
    const [currentStep, setCurrentStep] = useState(0);
    const [isClosing, setIsClosing] = useState(false);

    if (!visible) return null;

    const step = STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === STEPS.length - 1;

    async function handleClose(): Promise<void> {
        setIsClosing(true);
        await markOnboardingSeen();
        setVisible(false);
        setIsClosing(false);
    }

    function handleNext(): void {
        if (isLast) {
            void handleClose();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    }

    function handlePrev(): void {
        setCurrentStep((prev) => Math.max(0, prev - 1));
    }

    return (
        /* Overlay oscuro semitransparente */
        <div
            className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Tour de bienvenida"
        >
            {/* Card centrada con Crystal Glass styling */}
            <div
                className="w-full max-w-md rounded-2xl border border-white/[0.12] p-7 shadow-2xl"
                style={{
                    background: 'rgba(18, 19, 38, 0.92)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Indicador de pasos */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        {STEPS.map((s, idx) => (
                            <span
                                key={s.title}
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    width: idx === currentStep ? '20px' : '6px',
                                    background:
                                        idx <= currentStep
                                            ? '#9ea7ff'
                                            : 'rgba(255,255,255,0.15)',
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-[#9a9ab0]">
                        {currentStep + 1} / {STEPS.length}
                    </span>
                </div>

                {/* Contenido del paso */}
                <div className="mb-6 min-h-[80px]">
                    {isFirst && userName && (
                        <p className="mb-1 text-xs font-medium text-[#9ea7ff] uppercase tracking-widest">
                            Hola, {userName}
                        </p>
                    )}
                    <h2 className="mb-2 text-lg font-semibold text-[#e7e6fc]">{step.title}</h2>
                    <p className="text-sm leading-relaxed text-[#9a9ab0]">{step.description}</p>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between gap-3">
                    {/* Saltar — siempre visible mientras no sea el último paso */}
                    {!isLast ? (
                        <button
                            type="button"
                            onClick={() => void handleClose()}
                            disabled={isClosing}
                            className="text-xs text-[#9a9ab0] transition-colors hover:text-[#c4c3d8] disabled:opacity-50"
                        >
                            Saltar tour
                        </button>
                    ) : (
                        <span />
                    )}

                    <div className="flex gap-2">
                        {!isFirst && (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="rounded-lg border border-white/[0.1] px-4 py-2 text-sm font-medium text-[#9a9ab0] transition-colors hover:border-white/[0.2] hover:text-[#e7e6fc]"
                            >
                                Anterior
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isClosing}
                            className="rounded-lg bg-[#5a67d8] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4c56c0] disabled:opacity-50"
                        >
                            {isLast ? 'Comenzar' : 'Siguiente'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
