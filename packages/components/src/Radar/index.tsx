import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { Canvas, Image } from "@tarojs/components";
import { createSelectorQuery, createCanvasContext, canvasToTempFilePath, nextTick } from "@tarojs/taro";
import { drawCanvas } from "./drawCanvas";

export const Radar: FC<{
  className?: string;
  values: {
    label: string;
    value: number;
  }[];
}> = ({ values, className = "" }) => {
  const [imgPath, setImgPath] = useState("");
  useEffect(() => {
    drawCanvas.init(createCanvasContext("radar-canvas"), values);

    nextTick(() => {
      const query = createSelectorQuery();
      query
        .select("#radar-canvas")
        .fields({ node: true, size: true })
        .exec(res => {
          console.log(res);
          const canvas = res[0].node;

          canvasToTempFilePath({
            canvas,
            canvasId: "radar-canvas",
            success: (resp: any) => {
              setImgPath(resp.tempFilePath);
              console.log(resp.tempFilePath);
            }
          });
        });
    });
  }, []);

  return !imgPath ? (
    <Canvas id='radar-canvas' className={classNames("w-full h-588", className)} canvasId='radar-canvas' disableScroll={false} />
  ) : (
    <Image src={imgPath} className={classNames("w-full h-588", className)} />
  );
};
