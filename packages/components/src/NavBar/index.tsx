import React, { CSSProperties, FC, ReactNode, memo, useState } from "react";
import { usePageScroll } from "@tarojs/taro";
import classNames from "classnames";
import { routerBack, useSystemSize } from "@finalx/common";
import { Image, Text, View } from "@tarojs/components";
import "./index.scss";

interface NavBarProps {
  title?: string | null;
  style?: CSSProperties;
  icon?: ReactNode;
  scrollShow?: boolean;
  onBack?: () => any;
  showBack?: boolean;
}

export const NavBar: FC<NavBarProps> = memo(({ title = "", scrollShow, onBack, showBack = true, icon, style = {} }) => {
  const [top, setTop] = useState(0);
  const isScroll = top >= 110;
  const { customNavHeight, statusBarHeight } = useSystemSize();

  usePageScroll(({ scrollTop }) => {
    setTop(scrollTop);
  });

  return (
    <View
      className={classNames("sd_nav-bar", { bg: isScroll })}
      style={{
        height: customNavHeight + "PX",
        paddingTop: statusBarHeight + "PX",
        ...style
      }}
    >
      <View className='sd_nav-bar-content' style={{ height: customNavHeight - statusBarHeight + "PX" }}>
        {showBack && (
          <View
            className='sd_nav-bar-back-parent'
            onClick={() => {
              if (onBack) return onBack();
              routerBack();
            }}
          >
            {!icon ? (
              <Image className='sd_nav-bar-back-icon' src='https://cdn.wujuxian.net/static/7e44ce3ab64d4b95911ab66ef529f30b1689579223343.png' />
            ) : (
              icon
            )}
          </View>
        )}

        {(isScroll || !scrollShow) && <Text className='sd_nav-bar-title'>{title}</Text>}
      </View>
    </View>
  );
});
