import React, { memo } from 'react';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../atoms/Mask/Mask';
import Image from '../../atoms/Image/Image';
import Button from '../../atoms/Button/Button'
import Heading from '../../atoms/Heading/Heading';
import { useTranslation } from 'react-i18next';

export const NotifyPopup = ({
  title = '',
  body = '',
  isOpen = false,
  type = 'confirm',
  onClose,
  onConfirm,
  confirmBtnLabel,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();

  if (isOpen) {
    return (
      <Mask>
        <div className={[styles.notify_container, className].join(' ')} {...props}>
          {title && <Heading tag='h1' tag_style='h1' className={styles.notify_title}>{title}</Heading>}
          <Image src='/img/alert_icon.svg' type='info_list' className={styles.alert_img} style={{ 'width': '60px' }} />
          <Text size='xl' className={styles.notify_body}>{body}</Text>
          <div className={styles.btn_area}>
            {type == 'alert' ? (
              <Button onClick={onClose} className={styles.close_alert_btn}>{t('admin.close-btn')}</Button>
            ) : (
              <>
                <Button onClick={onClose}>{t('admin.cancel-btn')}</Button>
                <Button color='accent' onClick={onConfirm}>{confirmBtnLabel}</Button>
              </>
            )}
          </div>
        </div>
      </Mask>
    );
  }
}

