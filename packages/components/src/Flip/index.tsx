import React from "react";
import { FC, ReactNode } from "react";
import classNames from "classnames";
import "./index.scss";
import { View } from "@tarojs/components";

interface FlipProps {
  front: ReactNode;
  back: ReactNode;
  model: [boolean, Function];
  props?: any;
}
export const Flip: FC<FlipProps> = ({ front, back, model, ...props }) => {
  const [reverse, setReverse]: [boolean, Function] = model;

  return (
    <View {...props} className={classNames("card-filp", { reverse })} onClick={() => back && setReverse(!reverse)}>
      <View className='back'>{back}</View>
      <View className='front'>{front}</View>
    </View>
  );
};
