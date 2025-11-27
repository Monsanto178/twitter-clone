import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

type MediaEditing = {
    src: string;
    idx: number
}

type ToUpdate = {
    img: File;
    idx: number;
}

type Props = {
    src:string;
    idx:number;
    replyingModal: boolean;
    setCurMediaEditing: (media: MediaEditing | null) => void;
    setIsEditing: (bool:boolean) => void;
    setUpdateFile: (fileData: ToUpdate) => void
}

export const EditModal = ({src, idx, setCurMediaEditing, setIsEditing, setUpdateFile, replyingModal}:Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const imageRef = useRef<fabric.FabricImage>(null);
    const cropRef = useRef<fabric.Rect>(null);
    const [curEditing, setCurEditing] = useState(false);
    const [tempMedia, setTempMedia] = useState<MediaEditing>({src: src, idx: idx});
    const [canvasW, setCanvasW] = useState<number>(1200);
    const [canvasH, setCanvasH] = useState<number>(600);

    const [croppedImg, setCroppedImg] = useState<ToUpdate | null>(null);

    const closeModal = () => {
        setIsEditing(false);
        
        if(replyingModal) return;
        document.body.style.overflow = 'auto';
    };
    const DismissFile = () => setCurMediaEditing(null);
    const FinishEdit = () => {
        if(!tempMedia) {
            DismissFile();
            closeModal();
        }

        closeModal();
        setCurMediaEditing(tempMedia)
        if(croppedImg) {
            setUpdateFile(croppedImg);
        }
    };



    const createRec = () => {
        const cropRect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 200,
            height: 150,
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
            originX: 'left',
            originY: 'top',
        });
        cropRect.scaleX = 1;
        cropRect.scaleY = 1;
        cropRect.setControlsVisibility({
            mtr: false,
        });

        return cropRect;
    }
    
    const createClipPath = (rect: fabric.Rect, image: fabric.FabricImage) => {
        const updateClipPath = () => {
            if(!fabricCanvasRef.current) return;
            const clip = new fabric.Rect({
                width: rect.width! * rect.scaleX!,
                height: rect.height! * rect.scaleY!,
                left: rect.left,
                top: rect.top,
                absolutePositioned: true,
                originX: 'left',
                originY: 'top',
            });

            image.clipPath = clip;
            fabricCanvasRef.current.requestRenderAll();
        };

        return updateClipPath
    }

    const handleCropImg = async () => {
        if (!imageRef.current || !fabricCanvasRef.current || !cropRef.current) return;

        const canvas = fabricCanvasRef.current;
        const img = imageRef.current;
        const cropRect = cropRef.current;

        const cropBox = {
            left: cropRect.left!,
            top: cropRect.top!,
            width: cropRect.width! * cropRect.scaleX!,
            height: cropRect.height! * cropRect.scaleY!
        };

        const imgLeft = img.left ?? 0;
        const imgTop = img.top ?? 0;

        const scaleX = img.scaleX ?? 1;
        const scaleY = img.scaleY ?? 1;

        const relLeft = (cropBox.left - imgLeft) / scaleX;
        const relTop = (cropBox.top - imgTop) / scaleY;
        const relWidth = cropBox.width / scaleX;
        const relHeight = cropBox.height / scaleY;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = relWidth;
        croppedCanvas.height = relHeight;

        const ctx = croppedCanvas.getContext('2d');
        if (!ctx) return;

        const originalImg = new Image();
        originalImg.crossOrigin = 'anonymous';
        originalImg.src = img.getSrc();

        originalImg.onload = () => {
            ctx.drawImage(
                originalImg,
                relLeft,
                relTop,
                relWidth,
                relHeight,
                0,
                0,
                relWidth,
                relHeight
            );

            croppedCanvas.toBlob((blob) => {
                if(blob) {
                    const file = new File([blob], 'edited_image.png', {type: 'image/png'});
                    
                    const fileData: ToUpdate = {
                        img: file,
                        idx: idx
                    };

                    setCroppedImg(fileData);
                }
            })

            const croppedDataURL = croppedCanvas.toDataURL('image/png');

            fabric.FabricImage.fromURL(croppedDataURL).then((newImg) => {
                newImg.set({
                    left: img.left,
                    top: img.top,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                });

                canvas.remove(img);
                canvas.add(newImg);
                canvas.renderAll();

                setTempMedia({ src: croppedDataURL, idx: idx });
                setCurEditing(false);
            });
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
        const srcImg = tempMedia?.src;

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
            // img.rotate(imgAngle)
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

            if (curEditing) {
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
                // blurredImg.rotate(imgAngle)

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
            }
            canvas.add(img);
            canvas.centerObject(img);
        });

        return () => {
            isMounted = false;
            fabricCanvasRef.current?.dispose();
            fabricCanvasRef.current = null;
        };
    // }, [canvasRef, canvasW, canvasH, src, curEditing, imgAngle])
    }, [canvasRef, canvasW, canvasH, src, curEditing]);
    return(
        <>
        <div className="w-screen h-screen fixed inset-0 flex justify-center items-center z-999 bg-black">
            <div className="fixed inset-0 bg-black opacity-85 w-screen h-screen"></div>
            <div onClick={(e) => e.stopPropagation()} className="fixed">
                <button onClick={() => {closeModal(); DismissFile();}} className="absolute p-2 md:p-4 top-[0.5rem] md:top-[0.25rem] right-[0.25rem] md:right-[0.5rem] rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <canvas className="absolute inset-0 bg-black-500 border border-2" ref={canvasRef} />
                <div className='absolute p-2 buttom-[0.5rem] md:buttom-[0.25rem] left-[0.25rem] md:left-[0.5rem] flex gap-4 w-full'>
                    <div className={`${curEditing ? 'block' : 'hidden'} flex justify-evenly w-full`}>
                        <button onClick={() => {setCurEditing(false)}} className={`${curEditing ? 'block' : 'hidden'} rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99`}>
                            Cancel
                        </button>
                        <button onClick={handleCropImg} className={`rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99`}>
                            Apply
                        </button>
                    </div>
                    <div className={`${curEditing ? 'hidden' : 'block'} flex justify-evenly w-full`}>
                        <button onClick={() => {closeModal(); DismissFile();}} className="p-2 rounded-[50%] transition-all duration-300 ease-in-out hover:bg-red-500 cursor-pointer z-99">
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
                        <button onClick={() => {setCurEditing(true)}} className={`p-2 rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99`}>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#ffffff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-crop-icon lucide-crop">
                                    <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
                                    <path d="M18 22V8a2 2 0 0 0-2-2H2"/>
                            </svg>
                        </button>
                        <button onClick={FinishEdit} className="p-2 rounded-[50%] transition-all duration-300 ease-in-out hover:bg-green-400 cursor-pointer z-99">
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