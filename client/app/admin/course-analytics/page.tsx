"use client"
import {
    RelativePointer,
    MouseHandlerDataParam,
    getRelativeCoordinate,
    Area,
    AreaChart,
    XAxis,
    YAxis,
    Cross,
    useChartWidth,
    useChartHeight,
    Legend,
    Text,
    TextProps,
    ZIndexLayer,
    DefaultZIndexes,
} from "recharts";
import { useState, MouseEvent, TouchEvent, useCallback } from "react";


const TextWithOutline = (textProps: TextProps) => (
    <Text
        stroke="white"
        strokeWidth={3}
        fill="black"
        paintOrder="stroke"
        {...textProps}
    />
);

const PixelCrosshair = ({
    pointer,
}: {
    pointer: RelativePointer | null;
}) => {
    const width = useChartWidth();
    const height = useChartHeight();

    if (pointer == null || width == null || height == null) {
        return null;
    }

    return (
        <ZIndexLayer zIndex={DefaultZIndexes.cursorLine}>
            <TextWithOutline
                x={pointer.relativeX + 5}
                y={0}
                verticalAnchor="start"
            >
                {`x: ${pointer.relativeX}`}
            </TextWithOutline>

            <TextWithOutline
                x={width}
                y={pointer.relativeY + 5}
                textAnchor="end"
                verticalAnchor="start"
            >
                {`y: ${pointer.relativeY}`}
            </TextWithOutline>

            <Cross
                style={{ pointerEvents: "none" }}
                x={pointer.relativeX}
                y={pointer.relativeY}
                top={0}
                left={0}
                width={width}
                height={height}
                stroke="green"
                strokeWidth={1}
                strokeDasharray="4"
            />
        </ZIndexLayer>
    );
};

export default function CrosshairExample({
    initialPointers = [],
}: {
    initialPointers?: ReadonlyArray<RelativePointer>;
}) {
    const [pointers, setPointers] =
        useState<ReadonlyArray<RelativePointer>>(initialPointers);

    const handleMouseMove = useCallback(
        (
            _data: MouseHandlerDataParam,
            event: MouseEvent<SVGGraphicsElement>
        ) => {
            const chartPointer: RelativePointer = getRelativeCoordinate(event);
            setPointers([chartPointer]);
        },
        []
    );

    const handleTouchMove = useCallback(
        (_data: unknown, event: TouchEvent<SVGGraphicsElement>) => {
            const chartPointers: RelativePointer[] = getRelativeCoordinate(event);
            setPointers(chartPointers);
        },
        []
    );

    const handleLeave = useCallback(() => {
        setPointers([]);
    }, []);

    return (
        <AreaChart
            style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "200px",
                aspectRatio: 1,
                touchAction: "none",
            }}
            responsive
            onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleLeave}
        >
            <XAxis dataKey="label" />
            <YAxis width="auto" />

            <Area
                type="monotone"
                dataKey="x"
                stroke="var(--color-chart-1)"
                fill="none"
            />

            {pointers.map((pointer, index) => (
                <PixelCrosshair key={index} pointer={pointer} />
            ))}

            <Legend />
            <RechartsDevtools />
        </AreaChart>
    );
}