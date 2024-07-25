import React, { FC, ReactElement, useEffect, useImperativeHandle, useState, CSSProperties } from "react";
import classNames from "classnames";
import { View } from "@tarojs/components";
import "./index.scss";

interface ModalProps {
  status: boolean;
  setStatus: Function;
  onClose?: () => any;
  onCancel?: () => any;
  closeOnClickModal?: boolean;
  cRef?: any;
  hideBG?: boolean;
  arg?: any;
  children: ReactElement;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}

export const Modal: FC<ModalProps> = ({
  status,
  setStatus,
  closeOnClickModal = true,
  onClose,
  onCancel,
  children,
  cRef,
  hideBG,
  arg,
  style = {},
  contentStyle = {}
}) => {
  const [contentStatus, setContentStatus] = useState(false);

  useEffect(() => setContentStatus(status), [status]);
  const close = () => {
    setContentStatus(false);
    setTimeout(() => setStatus(arg || false), 150);
  };

  useImperativeHandle(cRef, () => ({ close }));

  return (
    <View
      catchMove
      className={classNames("fx_modal", {
        show: status,
        bg: !hideBG
      })}
      onClick={() => {
        if (!closeOnClickModal) return;
        close();
        onClose && onClose();
        onCancel && onCancel();
      }}
      style={style}
    >
      <View onClick={e => e.stopPropagation()} className={classNames(`fx_modal-scale-${contentStatus ? "in" : "out"}`)} style={contentStyle}>
        {children}
      </View>
    </View>
  );
};
