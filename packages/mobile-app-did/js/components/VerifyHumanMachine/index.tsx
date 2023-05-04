import React from 'react';
import Recaptcha from 'components/Recaptcha';
import OverlayModal from '../OverlayModal';
import { screenWidth, screenHeight } from '@portkey-wallet/utils/mobile/device';
import Config from 'react-native-config';
import { clearBackgroundTimeout, setBackgroundTimeout } from 'utils/backgroundTimer';

const TIME_OUT = 30000; // recaptcha timeout 30 seconds

async function verifyHumanMachine(language: any) {
  let timer: undefined | NodeJS.Timer;
  return new Promise((resolve, reject) => {
    OverlayModal.show(
      <Recaptcha
        lang={language}
        headerComponent={null}
        siteKey={Config.RECAPTCHA_SITE_KEY}
        baseUrl={Config.RECAPTCHA_BASE_URL}
        onVerify={token => {
          resolve(token as string);
          OverlayModal.hide();
        }}
        onExpire={() => {
          reject('expire');
        }}
        onClose={type => {
          OverlayModal.hide();
          if (type !== 'verified') reject();
        }}
        webViewProps={{
          onLoadEnd: () => {
            timer && clearBackgroundTimeout(timer);
          },
          onLoadStart: () => {
            timer = setBackgroundTimeout(() => {
              OverlayModal.hide();
              reject('time out');
            }, TIME_OUT);
          },
        }}
        onError={error => {
          reject(error);
          // OverlayModal.hide();
        }}
      />,
      {
        modal: true,
        type: 'zoomOut',
        position: 'center',
        containerStyle: {
          width: screenWidth,
          height: screenHeight,
        },
      },
    );
  });
}

export { verifyHumanMachine };
