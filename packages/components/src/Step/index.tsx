import React, { CSSProperties, FC } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

const map = new Map([
  [20, "45"],
  [25, "60"],
  [33, "88"],
  [50, "133"]
]);

interface IStepProps {
  proportion?: number | string;
  activeColor?: string;
  slotColor?: string;
  pop?: { title?: string; style?: CSSProperties; onClick?: () => any };
  items: { title?: string; desc?: string }[];
}
export const Step: FC<IStepProps> = ({ proportion, items = [], pop, activeColor, slotColor }) => {
  const range = Math.floor(100 / items.length);

  function getOffset() {
    return map.get(range) || 0;
  }

  const { title, style, onClick } = pop || {};

  return (
    <View className='step' style={{ paddingTop: pop ? "102rpx" : "30rpx" }}>
      <View className='step-content'>
        <View className={`step-warpper ${"step-warpper-range-" + range}`}>
          {items.map((item, key) => {
            const { title, desc } = item;
            const active = Math.floor((Number(proportion) * items.length) / 100) >= key + 1;
            return (
              <View
                key={key}
                className={`step-round ${"step-round-" + (key + 1)} ${active ? "active" : ""}`}
                style={{ borderColor: active ? activeColor : slotColor }}
              >
                <View className='step-round-content'>
                  <View className='step-round-content-title'>{title}</View>
                  <View className='step-round-content-desc'>{desc}</View>
                </View>
              </View>
            );
          })}
        </View>

        <View className='step-groove'>
          <View className='step-groove-pipeline' style={{ backgroundColor: slotColor }} />
          <View
            className='step-groove-active'
            style={{
              backgroundColor: activeColor,
              width: `calc(${Number(proportion) >= 100 ? 100 : Number(proportion)}% - ${Number(proportion) >= 100 ? 0 : getOffset()}rpx)`
            }}
          >
            {pop && (
              <View className='step-groove-active-pop' onClick={onClick}>
                <View className='step-groove-active-pop-title' style={style}>
                  {title}
                </View>
                <View className='step-groove-active-pop-rect' />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
