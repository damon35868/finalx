import React from "react";
import { FC, ReactElement } from "react";
import classNames from "classnames";
import { View } from "@tarojs/components";
import "./index.scss";

interface BottomModalProps {
  status: boolean;
  setStatus?: (state: boolean) => any;
  onClose?: () => any;
  closeOnClickModal?: boolean;
  children: ReactElement;
  rounded?: boolean; //是否开启圆角
}

export const BottomModal: FC<BottomModalProps> = ({ status, setStatus, closeOnClickModal = true, onClose, children, rounded }) => {
  const close = () => {
    onClose && onClose();
    setStatus && setStatus(false);
  };

  return (
    <View className={classNames("sd_bottom-modal", { show: status })} onClick={() => closeOnClickModal && close()}>
      <View className={classNames("bg sd_bottom-modal-content", { active: status, rounded })} onClick={e => e.stopPropagation()}>
        <View className='sd_bottom-modal-content-main'>{children}</View>
      </View>
    </View>
  );
};
