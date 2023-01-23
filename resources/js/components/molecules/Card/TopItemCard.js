import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import useI18next from '../../context/I18nextContext';

const TopItemCard = ({
    src,
    to, 
    brand_name, 
    item_name, 
    price, 
    className = '',
    ...props
  }) => {

  const i18next = useI18next();

  return (
    <div className={className} {...props}>
        <Link to={to} className={styles.link_fill}>
            <div className={[styles.img_box, styles.mb_8].join(' ')}>
              <Image src={src} alt="item image" className={styles.top_item_img} />
            </div>
            <Text size='s' className={[styles.mb_4, styles.card_text, styles.font_bold].join(' ')}>{brand_name}</Text>
            <Text className={[styles.mb_4, styles.card_text].join(' ')}>{item_name}</Text>
            <Text className={[styles.card_text].join(' ')}>{price} ({i18next.t('user.tax-including')})</Text>
        </Link>
    </div>
  );

};

export default TopItemCard;