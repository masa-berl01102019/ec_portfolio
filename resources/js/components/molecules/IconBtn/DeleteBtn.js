import React from 'react';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const DeleteBtn = ({ children, size = 'm', onClick, className = '', ...props }) => {
  return (
    <Button size={size} onClick={onClick} className={[styles.icon_btn, className].join(' ')} {...props}>
      <Icon src='/img/trash_icon.svg' />
      <Text size={size}>{children}</Text>
    </Button>
  );
}

export default DeleteBtn;