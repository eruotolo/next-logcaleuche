'use client';

import { type ReactElement, useCallback, useState } from 'react';

import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

interface ImageCropperModalProps {
    open: boolean;
    imageSrc: string;
    onConfirm: (blob: Blob) => void;
    onCancel: () => void;
}

const OUTPUT_SIZE = 600;

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas');

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
    );

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (result) resolve(result);
                else reject(new Error('Canvas toBlob fallido'));
            },
            'image/webp',
            0.92,
        );
    });
}

export function ImageCropperModal({
    open,
    imageSrc,
    onConfirm,
    onCancel,
}: ImageCropperModalProps): ReactElement {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const onCropComplete = useCallback((_croppedArea: Area, pixels: Area): void => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleConfirm = useCallback(async (): Promise<void> => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
            onConfirm(blob);
        } catch {
            // El usuario puede reintentar
        } finally {
            setIsProcessing(false);
        }
    }, [croppedAreaPixels, imageSrc, onConfirm]);

    return (
        <Modal open={open} onClose={onCancel} title="Ajustar foto de perfil" size="md">
            <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
                <label
                    htmlFor="crop-zoom"
                    className="text-cg-outline text-[10px] font-bold tracking-tighter uppercase"
                >
                    Zoom
                </label>
                <input
                    id="crop-zoom"
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[rgba(255,255,255,0.15)] accent-[#2980b9]"
                />
            </div>

            <div className="mt-5 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isProcessing}>
                    Cancelar
                </Button>
                <Button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isProcessing || !croppedAreaPixels}
                >
                    {isProcessing ? 'Procesando...' : 'Confirmar'}
                </Button>
            </div>
        </Modal>
    );
}
