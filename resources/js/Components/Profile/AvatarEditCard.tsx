import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

type Props = {
    src:string;
    setIsEditing: (bool:boolean) => void;
    setUpdateFile: (fileData: File) => void
}

export const AvatarEditCard = ({src, setIsEditing, setUpdateFile}:Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const imageRef = useRef<fabric.FabricImage>(null);
    const cropRef = useRef<fabric.Circle>(null);
    const [canvasW, setCanvasW] = useState<number>(1200);
    const [canvasH, setCanvasH] = useState<number>(600);


    const closeModal = () => {
        setIsEditing(false);
        
        document.body.style.overflow = 'auto';
    };

    const FinishEdit = () => {
        closeModal();
    };



    const createRec = () => {
        const cropRect = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 100,
            fill: 'transparent',
            stroke: 'white',
            strokeWidth: 1,
            strokeUniform: true,
            transparentCorners: false,
            cornerColor: 'blue',
            cornerSize: 10,
            angle: 0,
            lockRotation: true,
            lockScalingFlip: true,
            originX: 'center',
            originY: 'center',
            minScaleLimit: 0.7,
        });
        cropRect.on('scaling', () => {
            if(cropRect.scaleX > 2) {
                cropRect.set('scaleX', 2);
            }
            if(cropRect.scaleY > 2) {
                cropRect.set('scaleY', 2);
            }
        });

        cropRect.scaleX = 1;
        cropRect.scaleY = 1;
        cropRect.setControlsVisibility({
            mtr: false,
            mt:false,
            mb:false,
            ml:false,
            mr:false,
        });

        return cropRect;
    }
    
    const createClipPath = (rect: fabric.Circle, image: fabric.FabricImage) => {
        const updateClipPath = () => {
            if(!fabricCanvasRef.current) return;
            const clip = new fabric.Circle({
                radius: rect.radius! * rect.scaleX!,
                left: rect.left,
                top: rect.top,
                absolutePositioned: true,
                originX: 'center',
                originY: 'center',
            });

            image.clipPath = clip;
            fabricCanvasRef.current.requestRenderAll();
        };

        return updateClipPath
    }

    const handleCropImg = async () => {

        if (!imageRef.current || !fabricCanvasRef.current || !cropRef.current) return;
        
        const img = imageRef.current;
        const cropRect = cropRef.current;
        const cropBox = {
            left: cropRect.left!,
            top: cropRect.top!,
            radius: cropRect.radius! * cropRect.scaleX!,
        };

        const imgLeft = img.left ?? 0;
        const imgTop = img.top ?? 0;

        const scaleX = img.scaleX ?? 1;
        const scaleY = img.scaleY ?? 1;

        const relLeft = (cropBox.left - imgLeft) / scaleX;
        const relTop = (cropBox.top - imgTop) / scaleY;
        const relRadius = cropBox.radius / scaleX;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = relRadius * 2;
        croppedCanvas.height = relRadius * 2;

        const ctx = croppedCanvas.getContext('2d');
        if (!ctx) return;

        const originalImg = new Image();
        originalImg.crossOrigin = 'anonymous';
        originalImg.src = img.getSrc();

        
        originalImg.onload = () => {
            const targetWidth = relRadius * 2;
            const targetHeight = relRadius * 2;

            ctx.drawImage(
                originalImg,
                relLeft - relRadius,
                relTop - relRadius,
                relRadius * 2,
                relRadius * 2,
                0,
                0,
                targetWidth,
                targetHeight
            );

            croppedCanvas.toBlob((blob) => {
                if(blob) {
                    const file = new File([blob], 'edited_image', {type: 'image/webp', lastModified: Date.now()});
                    
                    const fileData: File = file;
                    
                    setUpdateFile(fileData);
                    FinishEdit()
                }
            }, 'image/webp', 0.5)
        };
    }

    useEffect(() => {
        const handleResize = () => {
            const viewPortW = window.innerWidth;

            if (viewPortW < 768) {
                setCanvasW(400);
                setCanvasH(300);
                return
            }
            if (viewPortW < 1024) {
                setCanvasW(700);
                setCanvasH(450);
                return 
            }
            if (viewPortW < 1280) {
                setCanvasW(900);
                setCanvasH(520);
                return 
            }
            setCanvasW(1200);
            setCanvasH(600);
            return 
        }
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: canvasW, 
            height: canvasH
        });
        fabricCanvasRef.current = canvas;
        const srcImg = src;

        canvas.renderAll();

        let isMounted = true;

        fabric.FabricImage.fromURL(srcImg).then(async (img) => {
            if (!isMounted) return;
            const canvasAspect = canvas.width! / canvas.height!;
            const imageAspect = img.width! / img.height!;

            let scaleFactor;

            if (imageAspect >= canvasAspect) {
                scaleFactor = canvas.width! / img.width!;
            } else {
                scaleFactor = canvas.height! / img.height!;
            }
            img.scale(scaleFactor);
            img.set({ 
                left: 0, 
                top: 0,
                selectable: false,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true,
                evented: false,
            });

            function clampObjectToContainer(obj: fabric.Object, container: fabric.Object) {
                obj.setCoords();
                const objBounds = obj.getBoundingRect();
                const containerBounds = container.getBoundingRect();

                let updated = false;

                // left
                if (objBounds.left < containerBounds.left) {
                    obj.left += containerBounds.left - objBounds.left;
                    updated = true;
                }

                // right
                const objRight = objBounds.left + objBounds.width;
                const containerRight = containerBounds.left + containerBounds.width;
                if (objRight > containerRight) {
                    obj.left -= objRight - containerRight;
                    updated = true;
                }

                // up
                if (objBounds.top < containerBounds.top) {
                    obj.top += containerBounds.top - objBounds.top;
                    updated = true;
                }

                // down
                const objBottom = objBounds.top + objBounds.height;
                const containerBottom = containerBounds.top + containerBounds.height;
                if (objBottom > containerBottom) {
                    obj.top -= objBottom - containerBottom;
                    updated = true;
                }

                if (updated) {
                    obj.setCoords();
                }
            }
            
            canvas.on('object:modified', (e) => {
                const obj = e.target;
                if (!obj || !img) return;
                clampObjectToContainer(obj, img);
                canvas.renderAll();
            });

            canvas.on('object:modified', (e) => {
                const obj = e.target;
                if (!obj || !img) return;

                const bounding = obj.getBoundingRect();
                const container = img.getBoundingRect();

                const objBottom = bounding.top + bounding.height;
                const containerBottom = container.top + container.height;

                // Borde inferior
                if (objBottom > containerBottom) {
                    const availableHeight = containerBottom - bounding.top;
                    const currentScaledHeight = obj.getScaledHeight();

                    if (currentScaledHeight > 0) {
                    const scaleRatio = availableHeight / currentScaledHeight;
                    obj.scaleY *= scaleRatio;
                    }
                }

                // Borde superior
                if (bounding.top < container.top) {
                    const availableHeight = bounding.top + bounding.height - container.top;
                    const currentScaledHeight = obj.getScaledHeight();

                    if (currentScaledHeight > 0 && availableHeight > 0) {
                    const scaleRatio = availableHeight / currentScaledHeight;
                    obj.scaleY *= scaleRatio;
                    obj.top = container.top;
                    }
                }

                // Borde izquierdo
                if (bounding.left < container.left) {
                    const availableWidth = bounding.left + bounding.width - container.left;
                    const currentScaledWidth = obj.getScaledWidth();

                    if (currentScaledWidth > 0 && availableWidth > 0) {
                    const scaleRatio = availableWidth / currentScaledWidth;
                    obj.scaleX *= scaleRatio;
                    obj.left = container.left;
                    }
                }

                // Borde derecho
                const objRight = bounding.left + bounding.width;
                const containerRight = container.left + container.width;

                if (objRight > containerRight) {
                    const availableWidth = containerRight - bounding.left;
                    const currentScaledWidth = obj.getScaledWidth();

                    if (currentScaledWidth > 0) {
                    const scaleRatio = availableWidth / currentScaledWidth;
                    obj.scaleX *= scaleRatio;
                    }
                }

                obj.setCoords();
                canvas.renderAll();
            });

            imageRef.current = img;            
                const cropRect = createRec();
                const updateClipPath = createClipPath(cropRect, img);

                const bgRect = new fabric.Rect({
                    left: 0,
                    top: 0,
                    width: canvas.width,
                    height: canvas.height,
                    fill: 'rgba(0, 0, 0, 0.7)',
                    stroke: 'transparent',
                    strokeWidth: 0,
                    transparentCorners: false,
                    cornerColor: 'transparent',
                    cornerSize: 0,
                    hasRotatingPoint: false,
                    evented:false,
                    selectable:false
                });

                const blurredImg = await img.clone();

                blurredImg.set({
                    selectable: false,
                    evented: false,
                });

                cropRef.current = cropRect;

                cropRect.on('modified', updateClipPath);
                cropRect.on('moving', updateClipPath);
                cropRect.on('scaling', updateClipPath);

                canvas.add(blurredImg);
                canvas.add(bgRect)
                canvas.add(cropRect);

                canvas.centerObject(blurredImg);
                canvas.centerObject(bgRect);
                canvas.centerObject(cropRect);

                updateClipPath();
            // }
            canvas.add(img);
            canvas.centerObject(img);
        });

        return () => {
            isMounted = false;
            fabricCanvasRef.current?.dispose();
            fabricCanvasRef.current = null;
        };
    }, [canvasRef, canvasW, canvasH, src]);
    return(
        <>
        <div className="w-screen h-screen fixed inset-0 flex justify-center items-center z-999 bg-black">
            <div className="fixed inset-0 bg-black opacity-85 w-screen h-screen"></div>
            <div onClick={(e) => e.stopPropagation()} className="fixed">
                <button onClick={() => {closeModal();}} 
                    className="absolute p-2 md:p-4 top-[0.5rem] md:top-[0.25rem] right-[0.25rem] md:right-[0.5rem] rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <canvas className="absolute inset-0 bg-black-500 border border-2" ref={canvasRef} />
                <div className='absolute p-2 buttom-[0.5rem] md:buttom-[0.25rem] left-[0.25rem] md:left-[0.5rem] flex gap-4 w-full'>
                    <div className={`flex justify-evenly w-full`}>
                        <button onClick={() => {closeModal()}} className="p-2 rounded-[50%] transition-all duration-300 ease-in-out hover:bg-red-500 cursor-pointer z-99">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#ffffff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-x-icon lucide-x">
                                    <path d="M18 6 6 18"/>
                                    <path d="m6 6 12 12"/>
                            </svg>
                        </button>
                        <button onClick={handleCropImg} className="p-2 rounded-[50%] transition-all duration-300 ease-in-out hover:bg-green-400 cursor-pointer z-99">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#ffffff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-check-icon lucide-check">
                                    <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}