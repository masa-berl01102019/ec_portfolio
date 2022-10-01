import React, {memo, useState} from 'react';
import Text from '../../atoms/Text/Text';
import Mask from '../../atoms/Mask/Mask';
import Image from '../../atoms/Image/Image';
import Button from '../../atoms/Button/Button';
import styles from './styles.module.css';
import CartBtn from '../IconBtn/CartBtn';

const CartPopup = ({
    item,
    sizes,
    closeMethod,
    createData,
    ...props
  }) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
      <Mask>
      { !isOpen ? (
          <div className={styles.container}>
            { item.skus.map( (sku, index) => 
              <div key={index} className={styles.mb_24} >
                <div className={styles.img_area}>
                    <Image 
                        src={sku.img ? sku.img : '/img/no_image.png'} 
                        alt="商品画像" 
                        style={{'width' : '50px', 'marginRight': '8px'}} 
                    />
                    <Text>{sku.color_name}</Text>
                </div>
                <ul>
                  { sku.sizes.map((sku_item, index) => 
                    <li key={index} className={styles.stock_area}>
                        <span>
                            { sizes.filter((size) => size.id == sku_item.size_id).map(el => (
                                <Text tag='span' key={el.id} className={[styles.text_height, styles.mr_8].join(' ')}>{el.size_name}</Text>
                            ))}
                            <Text tag='span' className={styles.text_height}>{sku_item.quantity > 0 ? '在庫有り': '在庫無し'}</Text>
                        </span>
                        <CartBtn 
                            onClick={() => {
                                setIsOpen(true);
                                createData({
                                    form: {sku_id: `${sku_item.id}`},
                                    url:`/api/user/carts`,
                                    callback: () => setTimeout(closeMethod, 1000)
                                });
                            }}
                            disabled={item.cart_items.includes(sku_item.id)}
                        >
                            カート追加
                        </CartBtn>
                    </li>
                  )}
                </ul>
              </div>
            )}
            <Button className={styles.close_btn} onClick={closeMethod} >閉じる</Button>
          </div>
      ) : (
        <div className={styles.content}>
          <Image src='/img/complete_icon.svg' type='info_list' className={styles.img} />
          <Text size='xl' role='reverse' className={styles.nowrap}>カートに追加しました</Text>
        </div>
      )}
      </Mask>
    );
};

export default CartPopup;