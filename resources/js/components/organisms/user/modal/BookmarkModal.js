import React, {memo, useState} from 'react';
import Text from '../../../atoms/Text/Text';
import Mask from '../../../atoms/Mask/Mask';
import Image from '../../../atoms/Image/Image';
import Button from '../../../atoms/Button/Button';
import BookmarkBtn from '../../../molecules/IconBtn/BookmarkBtn';
import styles from './styles.module.css';
import CompletePopup from '../../../molecules/Popup/CompletePopup';

const BookmarkModal = ({
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
          <div className={[styles.container, styles.max_width].join(' ')}>
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
                        <BookmarkBtn 
                          onClick={() => {
                            setIsOpen(true);
                            createData({
                              form: {sku_id: `${sku_item.id}`}, 
                              url:`/api/user/bookmarks`,
                              callback: () => setTimeout(closeMethod, 1000)
                            });
                          }}
                          disabled={item.bookmark_items.includes(sku_item.id)}
                          className={styles.bookmark_btn_width}
                        >
                          {item.bookmark_items.includes(sku_item.id) ? 'お気に入り登録済' : 'お気に入り追加'}
                        </BookmarkBtn>
                    </li>
                  )}
                </ul>
              </div>
            )}
            <Button className={styles.close_btn} onClick={closeMethod} >閉じる</Button>
          </div>
      ) : (
        <CompletePopup isOpen={true}>お気に入りに追加しました</CompletePopup>
      )}
      </Mask>
    );
};

export default BookmarkModal;