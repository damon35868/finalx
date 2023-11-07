import React, { CSSProperties, FC } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

interface IStepProps {
  proportion?: number | string;
  activeColor?: string;
  slotColor?: string;
  pop?: { title?: string; style?: CSSProperties; onClick?: () => any };
  items: { title?: string; desc?: string; process?: number }[];
}
export const Step: FC<IStepProps> = ({
  proportion,
  items = [],
  pop,
  activeColor,
  slotColor,
}) => {
  const { title, style, onClick } = pop || {};

  return (
    <View className="step" style={{ paddingTop: pop ? "102rpx" : "30rpx" }}>
      <View className="step-content">
        <View className="step-warpper">
          {items.map((item, key) => {
            const { title, desc, process = 0 } = item;
            const active = Number(proportion) >= process;

            return (
              <View
                key={key}
                className={`step-round ${"step-round-" + (key + 1)} ${
                  active ? "active" : ""
                }`}
                style={{
                  left: `calc(${process + "%"} - 40rpx)`,
                  borderColor: active ? activeColor : slotColor,
                }}
              >
                <View className="step-round-content">
                  <View className="step-round-content-title">{title}</View>
                  <View className="step-round-content-desc">{desc}</View>
                </View>
              </View>
            );
          })}
        </View>

        <View className="step-groove">
          <View
            className="step-groove-pipeline"
            style={{ backgroundColor: slotColor }}
          />
          <View
            className="step-groove-active"
            style={{
              backgroundColor: activeColor,
              width: `${Number(proportion) >= 100 ? 100 : Number(proportion)}%`,
            }}
          >
            {pop && (
              <View className="step-groove-active-pop" onClick={onClick}>
                <View className="step-groove-active-pop-title" style={style}>
                  {title}
                </View>
                <View className="step-groove-active-pop-rect" />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
