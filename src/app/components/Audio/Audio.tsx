import React, { forwardRef, useImperativeHandle, useRef } from "react";

export type AudioProps = {
    src: string;
};

export const Audio = forwardRef((props: AudioProps, ref) => {

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useImperativeHandle(ref, () => ({
        playAudio: () => {
            audioRef.current?.play();
        },
        pausarAudio: () => {
            audioRef.current?.pause();
        },
    }));

    return (
        <>
            <audio ref={audioRef}>
                <source src={props.src} type="audio/mpeg" />
            </audio>
        </>
    );
});

Audio.displayName = 'Audio';
