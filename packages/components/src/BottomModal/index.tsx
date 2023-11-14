import React, { ReactNode, FC, CSSProperties, useEffect } from "react";
import classNames from "classnames";
import { View } from "@tarojs/components";
import "./index.scss";

interface BottomModalProps {
  status: boolean;
  setStatus?: (state: boolean) => any;
  onClose?: () => any;
  closeOnClickModal?: boolean;
  children: ReactNode;
  rounded?: boolean; //是否开启圆角
  style?: CSSProperties;
}

export const BottomModal: FC<BottomModalProps> = ({ status, setStatus, closeOnClickModal = true, onClose, style = {}, children, rounded }) => {
  const close = () => {
    onClose && onClose();
    setStatus && setStatus(false);
  };

  return (
    <View catchMove style={style} className={classNames("sd_bottom-modal", { show: status })} onClick={() => closeOnClickModal && close()}>
      <View className={classNames("bg sd_bottom-modal-content", { active: status, rounded })} onClick={e => e.stopPropagation()}>
        <View className='sd_bottom-modal-content-main'>{children}</View>
      </View>
    </View>
  );
};
