import React, {Suspense, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {CircularProgress} from "@material-ui/core";
import { useCookies } from 'react-cookie';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import Image from '../../../atoms/Image/Image';
import InfoCard from '../../../molecules/Card/InfoCard';
import TopItemCard from '../../../molecules/Card/TopItemCard';
import RadioBoxTab from '../../../atoms/RadioboxTab/RadioBoxTab';
import MeasurementTable from '../../../organisms/user/Table/MeasurementTable';
import BookmarkBtn from '../../../molecules/IconBtn/BookmarkBtn';
import CartBtn from '../../../molecules/IconBtn/CartBtn';
import styles from '../styles.module.css';
import BookmarkPopup from '../../../molecules/Popup/BookmarkPopup';
import CartPopup from '../../../molecules/Popup/CartPopup';

function ItemShowPage(props) {
    // urlの設定
    const baseUrl = `/api/user/items/${props.match.params.id}`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ITEM';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData2(baseUrl, model);
    // cookieを管理
    const [cookies, setCookie] = useCookies();
    // API接続の返却値を変数に格納
    const item = data.item;
    const sizes = data.sizes? data.sizes: null;
    const related_items = data.related_items? data.related_items: null;

    const [tab, setTab] = useState('1');
    const [popup, setPopup] = useState('');
 

    useEffect(() => {
        if(item) {
            if(cookies.item_info) {
                // cookieからIDの配列を取得
                const cookie_id_arr = cookies.item_info;
                // cookieに保存されてる商品IDと渡ってきたIDが一致しなければ
                if(!cookie_id_arr.includes(item.id)) {
                    // 配列の先頭に追加
                    cookies.item_info.unshift(item.id);
                    // cookieに保存
                    setCookie('item_info', JSON.stringify(cookies.item_info), { maxAge : 60 * 60 * 24 } );
                }

                // オブジェクトの生成
                const storage_info = {
                    'id' : item.id,
                    'brand_name' : item.brand_name,
                    'item_name' : item.item_name,
                    'included_tax_price_text' : item.included_tax_price_text,
                    'top_image' : item.top_image,
                    'url' : window.location.href,
                };
                // decodeして変数に格納 * cookieが消えてもlocalStrageは残り続けてしまうので更新時にcookieと同期
                const storage_arr = JSON.parse(localStorage.getItem('viewed_items')).filter(list => cookie_id_arr.includes(list.id));
                // IDを配列で取得));
                const storage_id_arr = storage_arr.map(list => list.id);
                // localStorageに保存されてる商品IDと渡ってきたIDが一致しなければ
                if(!storage_id_arr.includes(item.id)) {
                    // 配列の先頭に追加
                    storage_arr.unshift(storage_info);
                    // local storageに保存
                    localStorage.setItem('viewed_items', JSON.stringify(storage_arr));
                }
            } else {
                // 配列の初期化
                const cookie_arr = [];
                const storage_arr = [];
                // local storageに保存
                const storage_info = {
                    'id' : item.id,
                    'brand_name' : item.brand_name,
                    'item_name' : item.item_name,
                    'included_tax_price_text' : item.included_tax_price_text,
                    'top_image' : item.top_image,
                    'url' : window.location.href,
                };
                storage_arr.push(storage_info);
                localStorage.setItem('viewed_items', JSON.stringify(storage_arr));
                // 商品IDのみcookieに追加して保存
                cookie_arr.push(item.id);
                setCookie('item_info', JSON.stringify(cookie_arr), { maxAge : 60 * 60 * 24 } );
            }
        }
    },[baseUrl]);

    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        {   popup == '1' && 
                            <CartPopup
                                item={item} 
                                sizes={sizes} 
                                createData={createData} 
                                closeMethod={() => setPopup('')} 
                            />
                        }

                        {   popup == '2' && 
                            <BookmarkPopup 
                                item={item} 
                                sizes={sizes} 
                                createData={createData} 
                                closeMethod={() => setPopup('')} 
                            />
                        }


                        <div className={styles.main_contents_area}>
                            <div className={styles.item_detail_area}>
                                {/* TODO: thumbnailタッチすると画像が切り替わるようにする */}
                                <div className={styles.item_img_area}>
                                    <Image src={item.top_image} alt="商品画像" className={styles.item_top_img}/>
                                    <div className={styles.item_thumbnail_area}>
                                        {   item.images &&
                                            item.images.map((list, index) =>
                                                <Image 
                                                    key={index}
                                                    src={list.image ? list.image : '/img/no_image.png'} 
                                                    alt="商品画像" 
                                                    style={{'width' : '16%'}}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className={styles.item_info_area}>
                                    <div className={styles.item_basic_info_area}>
                                        <Text className={styles.mb_8}>{item.brand_name}</Text>
                                        <Text className={styles.mb_8}>{item.item_name}</Text>
                                        <Text size='l'>{item.included_tax_price_text} (税込)</Text>
                                    </div>
                                    <div className={styles.show_item_btn_area}>
                                        {/* TODO: ログインしてなくてもカート登録出来てしまう */}
                                        <CartBtn size='l' onClick={() => setPopup('1')} className={styles.mb_16}>カートに入れる</CartBtn>
                                        <BookmarkBtn size='l' onClick={() => setPopup('2')} >お気に入りに登録する</BookmarkBtn>
                                    </div>
                                    <div className={[styles.flex, styles.mb_32].join(' ')}>
                                        <RadioBoxTab
                                            name='switch_tab' 
                                            value={'1'} 
                                            onChange={e => setTab(e.target.value)} 
                                            checked={tab == '1'} 
                                            label={'サイズ・詳細'}
                                            style={{'flex' : '1'}}
                                        />
                                        <RadioBoxTab
                                            name='switch_tab' 
                                            value={'2'} 
                                            onChange={e => setTab(e.target.value)} 
                                            checked={tab == '2'} 
                                            label={'商品説明'}
                                            style={{'flex' : '1'}}
                                        />
                                    </div>
                                    { tab == '1' ? (
                                        <div className={styles.mb_32}>
                                            <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>サイズ表</Heading>
                                            <MeasurementTable 
                                                measurements={item.measurements} 
                                                sizes={sizes} 
                                                className={styles.mb_24} 
                                            />
                                            <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>商品詳細</Heading>
                                            <ul>
                                                <li className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <Text className={[styles.bold, styles.flex_basis_80p].join(' ')}>カラー </Text>
                                                    <Text className={styles.flex_1}>{item.color_variation.join(' / ') }</Text>
                                                </li>
                                                <li className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <Text className={[styles.bold, styles.flex_basis_80p].join(' ')}>サイズ </Text>
                                                    <Text className={styles.flex_1}>{item.size_variation.join(' / ') }</Text>
                                                </li>
                                                <li className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <Text className={[styles.bold, styles.flex_basis_80p].join(' ')}>性別 </Text>
                                                    <Text className={styles.flex_1}>{item.gender_category}</Text>
                                                </li>
                                                <li className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <Text className={[styles.bold, styles.flex_basis_80p].join(' ')}>カテゴリ </Text>
                                                    <Text className={styles.flex_1}>{item.main_category + ' > ' + item.sub_category}</Text>
                                                </li>
                                                <li className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <Text className={[styles.bold, styles.flex_basis_80p].join(' ')}>素材 </Text>
                                                    <Text className={styles.flex_1}>{item.mixture_ratio}</Text>
                                                </li>
                                                <li className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <Text className={[styles.bold, styles.flex_basis_80p].join(' ')}>生産国 </Text>
                                                    <Text className={styles.flex_1}>{item.made_in}</Text>
                                                </li>
                                                <li className={styles.flex}>
                                                    <Text className={[styles.bold, styles.flex_basis_80p].join(' ')}>品番 </Text>
                                                    <Text className={styles.flex_1}>{item.product_number}</Text>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <Text className={styles.mb_32}>{item.description}</Text>
                                    )}
                                </div>
                            </div>
                            <div className={styles.item_related_area}>
                                {   item.publishedBlogs &&
                                    <>
                                        <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>関連ブログ</Heading>
                                        <div className={styles.mb_32}>
                                            {
                                                item.publishedBlogs.map((blog) =>
                                                    <InfoCard
                                                        key={blog.id}
                                                        src={blog.thumbnail}
                                                        to={`/blogs/${blog.id}`}
                                                        title={blog.title}
                                                        brand_name={blog.brand_name}
                                                        posted_at={blog.posted_at}
                                                        modified_at={blog.modified_at}
                                                    />
                                                )
                                            }
                                        </div>
                                    </>
                                }  
                                {   related_items &&
                                    <>
                                        <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>関連商品</Heading>
                                        <div className={[styles.show_card_area, styles.mb_32].join(' ')}>
                                            {   related_items.map((item) =>
                                                    <TopItemCard 
                                                        key={item.id}
                                                        src={item.top_image}
                                                        to={`/items/${item.id}`}
                                                        brand_name={item.brand_name}
                                                        item_name={item.item_name}
                                                        price={item.included_tax_price_text}
                                                        className={styles.item_card}
                                                        // style={{'width' : '29%', 'marginBottom' : '16px'}}
                                                    />
                                                )
                                            }
                                        </div>
                                    </>
                                }
                                { JSON.parse(localStorage.getItem('viewed_items')) && cookies.item_info &&
                                    <>
                                        <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>チェックした商品</Heading>
                                        <div className={[styles.flex, styles.scroll_x].join(' ')}>
                                        {   
                                            JSON.parse(localStorage.getItem('viewed_items')).filter(list => cookies.item_info.includes(list.id)).map(list => (
                                                <Link to={`/items/${list.id}`} key={list.id}>
                                                    <Image src={list.top_image} alt="閲覧商品画像" className={styles.history_recodes}/> 
                                                </Link>
                                            ))
                                        }
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </>
                )
            }
            </Suspense>
        </main>
    );
}

export default ItemShowPage;