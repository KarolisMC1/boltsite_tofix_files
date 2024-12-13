import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { Trace } from '@voiceflow/base-types';
import { WidgetSettingsChatRenderMode } from '@voiceflow/dtos-interact';
import clsx from 'clsx';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';

import { Launcher } from '@/components/Launcher';
import { LAUNCHER_SIZE, LAUNCHER_WIDTH_LABEL_SIZE } from '@/components/Launcher/styles.css';
import { Proactive } from '@/components/Proactive';
import { ClassName } from '@/constants';
import { RuntimeStateAPIContext, RuntimeStateContext } from '@/contexts';
import { useChatAPI } from '@/hooks/useChatAPI';
import { usePalette } from '@/hooks/usePalette';
import { THEME } from '@/styles/colors.css';
import { FAMILY } from '@/styles/font';
import { BREAKPOINTS } from '@/styles/sizes';
import { useResolveAssistantStyleSheet } from '@/utils/stylesheet';
import { ChatWindow } from '@/views/ChatWindow';

import { chatContainer, LAUNCHER_MARGIN, launcherContainer, popoverBackdrop, widgetContainer } from './styles.css';

interface ChatWidgetProps extends React.PropsWithChildren {
  shadowRoot?: ShadowRoot;
  chatAPI: VoiceflowChat | undefined;
  ready?: () => void;
  chatWindow?: React.ReactNode;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ shadowRoot, chatAPI, ready }) => {
  const { assistant, open, close, interact } = useContext(RuntimeStateAPIContext);
  const { isOpen } = useContext(RuntimeStateContext);
  /** initialization  */
  const [isHidden, setHidden] = useState(false);
  const [proactiveMessages, setProactiveMessages] = useState<Trace.AnyTrace[]>([]);

  const checkMobile = () => window.matchMedia(`(max-width: ${BREAKPOINTS.mobile})`).matches;
  const [isMobile, setIsMobile] = useState(checkMobile());
  useLayoutEffect(() => {
    setIsMobile(checkMobile());
  }, []);

  const palette = usePalette(assistant);

  const toggleChat = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  useChatAPI(
    chatAPI,
    () => ({
      open,
      close,
      hide: () => setHidden(true),
      show: () => setHidden(false),
      interact,
      proactive: {
        clear: () => setProactiveMessages([]),
        push: (...messages: Trace.AnyTrace[]) => setProactiveMessages((prev) => [...prev, ...messages]),
      },
    }),
    ready
  );

  const side = assistant.common.position;
  const position = { bottom: `${assistant.common.bottomSpacing}px`, [side]: `${assistant.common.sideSpacing}px` };
  const launcherButtonSize = assistant.common.launcher.type === 'label' ? LAUNCHER_WIDTH_LABEL_SIZE : LAUNCHER_SIZE;
  const chatHeight = `calc(100% - ${launcherButtonSize + LAUNCHER_MARGIN + parseInt(assistant.common.bottomSpacing, 10) + 20}px)`;

  const widgetPosition = {
    [side]: position[side],
    bottom: `${parseInt(position.bottom, 10) + launcherButtonSize + LAUNCHER_MARGIN}px`,
    height: chatHeight,
  };
  const isPopover = assistant.chat.renderMode === WidgetSettingsChatRenderMode.POPOVER;

  const chatContainerPosition = isMobile || isPopover ? {} : widgetPosition;
  const isStyleSheetResolved = useResolveAssistantStyleSheet(assistant, shadowRoot);
  const customFontFamily = assistant.common.fontFamily;
  const isDefaultFont = customFontFamily === 'UCity Pro';

  useEffect(() => {
    if (isDefaultFont) return;

    const link = document.createElement('link');

    const fontFamilyNameForImport = customFontFamily.replace(/ /g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilyNameForImport}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, [customFontFamily]);

  if (!isStyleSheetResolved) return null;
  if (!palette) return null;

  return (
    <>
      <div
        style={assignInlineVars(THEME, {
          colors: palette,
          fontFamily: isDefaultFont ? FAMILY : `'${customFontFamily}'`,
        })}
        className={clsx(ClassName.WIDGET, widgetContainer({ hidden: isHidden, withChat: isOpen }))}
      >
        <div className={launcherContainer} style={position}>
          <Proactive side={side} messages={proactiveMessages} />
          <Launcher
            onClick={toggleChat}
            isOpen={isOpen}
            type={assistant.common.launcher.type}
            image={assistant.common.launcher.imageURL}
            label={assistant.common.launcher.text}
          />
        </div>
        <div className={popoverBackdrop({ visible: isPopover && isOpen })} onClick={() => close()} />
        <div className={chatContainer({ popover: isPopover })} style={chatContainerPosition}>
          <ChatWindow isMobile={isMobile} isPopover={isPopover} />
        </div>
      </div>
    </>
  );
};
