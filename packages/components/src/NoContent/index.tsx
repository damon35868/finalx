import React, { CSSProperties, FC } from "react";
import { Image, View } from "@tarojs/components";
import "./index.scss";

interface NoContentProps {
  model: any;
  text?: string;
  style?: CSSProperties;
  color?: string;
  textColor?: string;
}

export const NoContent: FC<NoContentProps> = ({ model, text, textColor = "", color = "", style }) => {
  const { data } = model || {};

  const { hasNextPage = true } = data || {};

  if (hasNextPage) return null;

  return (
    <View className='no-content' style={style}>
      <View className='no-content-line' style={{ backgroundColor: color }} />
      <View className='no-content-text' style={{ color: textColor }}>
        {text || "没有更多了"}
      </View>
      <View className='no-content-line' style={{ backgroundColor: color }} />
    </View>
  );
};

interface NoContentRectProps {
  model: any;
  text?: string;
  src?: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
  imgStyle?: CSSProperties;
  children?: any;
}
export const NoContentRect: FC<NoContentRectProps> = ({
  model,
  text,
  src = "https://cdn.wujuxian.net/static/5c3322c04cab9220e28b1d3bbc447bd51683626100455.png",
  style,
  textStyle,
  imgStyle,
  children
}) => {
  const { data } = model;
  const { totalCount = 1 } = data || {};
  if (totalCount) return null;

  return (
    <View className='no-content-rect' style={style}>
      {children ? children : <Image className='no-content-rect-img' w-448 h-448 src={src} style={imgStyle} />}
      {text && (
        <View className='no-content-rect-text' style={textStyle}>
          {text}
        </View>
      )}
    </View>
  );
};
