import React from "react";
import { FC, ReactElement, useRef } from "react";
import { Modal } from "../Modal";
import { Button, View } from "@tarojs/components";
import "./index.scss";

interface DialogProps {
  status: boolean;
  content: {
    title: string;
    desc: string | ReactElement;
    btnText: string;
  };
  onCancel?: () => any;
  setStatus: (state: boolean) => any;
  onClose?: () => any;
  onClick?: (close: any) => any;
}

export const Dialog: FC<DialogProps> = ({ status, setStatus, content, onClick, onCancel }) => {
  const { title, desc, btnText } = content;
  const ref = useRef<{ close: Function }>();

  return (
    <Modal cRef={ref} status={status} setStatus={setStatus} onCancel={onCancel}>
      <View className='sd_dialog'>
        <View className='sd_dialog-title'>{title}</View>
        <View className='sd_dialog-desc'>{desc}</View>
        <Button className='sd_dialog-btn' onClick={() => onClick && onClick(ref.current?.close)}>
          {btnText}
        </Button>
      </View>
    </Modal>
  );
};
