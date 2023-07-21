import React, { CSSProperties, FC } from "react";
import { View } from "@tarojs/components";
import { useSystem, useSystemSize } from "@finalx/common";
import "./index.scss";

interface WrapperProps {
  space?: boolean;
  bottomSpace?: boolean;
  bgColor?: string;
  style?: CSSProperties;
  children?: any;
}

export const Wrapper: FC<WrapperProps> = ({ space = true, bottomSpace, children, bgColor, style = {} }) => {
  const { customNavHeight } = useSystemSize();

  return (
    <View
      style={{
        backgroundColor: bgColor || "",
        paddingTop: space ? customNavHeight + 10 + "PX" : "",
        paddingBottom: bottomSpace ? "calc(env(safe-area-inset-bottom) + 120rpx)" : "",
        ...style
      }}
    >
      {children}
    </View>
  );
};

interface BottomWrapperProps {
  children?: any;
  height?: string;
  wrapperStyle?: CSSProperties;
  style?: CSSProperties;
}
export const BottomWrapper: FC<BottomWrapperProps> = ({ height = "106rpx", wrapperStyle = {}, style = {}, children }) => {
  const { system } = useSystem();
  const isAndroid = system === "android";

  return (
    <View className='bottom-wrapper' style={wrapperStyle}>
      <View
        className='bottom-wrapper-content'
        style={{
          height,
          paddingBottom: isAndroid ? "calc(env(safe-area-inset-bottom) + 10px)" : "env(safe-area-inset-bottom)",
          ...style
        }}
      >
        {children}
      </View>
    </View>
  );
};
