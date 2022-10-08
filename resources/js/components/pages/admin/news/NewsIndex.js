import React, {Suspense, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import Pagination from '../../../molecules/Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import Heading from '../../../atoms/Heading/Heading';
import FilterSortBtn from '../../../molecules/IconBtn/FilterSortBtn';
import NewsTable from '../../../organisms/admin/Table/NewsTable';
import Text from '../../../atoms/Text/Text';
import NewsSidebar from '../../../organisms/admin/SideBar/NewsSidebar';
import CreateLink from '../../../molecules/IconLink/CreateLink';
import styles from '../styles.module.css';
import { menuAdminState } from '../../../store/menuState';

function NewsIndex() {
    // urlの設定
    const baseUrl = `/api/admin/news`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NEWS';
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage, deleteData, getCSVData} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    // APIから取得したデータを変数に格納
    const news = data.data ? data.data: null;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;
    // 検索タブのステータス
    const [open, setOpen] = useState(false);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('NEWSにてparamsの初期値をセット');
            setParams({
                paginate: {},
                sort: { 'posted_at' : '', 'modified_at' : '' },
                filter: { 'search' : '', 'is_published' : '', 'tag' : [], 'brand' : [], 'item' : [], 'gender_category' : [], 'target_span' : '', 'from' : null, 'to' : null },
                scope: model
            });
        }
    },[]);

    
    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.flex].join(' ') : [styles.container, styles.flex].join(' ') }>
                        {   open && 
                            <NewsSidebar
                                brands={brands}
                                gender_categories={gender_categories}
                                tags={tags}
                                model={model}
                                onClick={() => setOpen(false)}
                            />
                        }
                        <div className={open ? [styles.open_sidebar, styles.flex_1].join(' ') : styles.flex_1}>

                            <div className={styles.index_title}>
                                <Heading tag={'h1'} tag_style={'h1'} className={styles.mr_auto}>
                                    ニュース一覧 { data.meta && ` ( ${data.meta.total} 件 )`}
                                </Heading>
                                <div className={[styles.flex, styles.btn_area].join(' ')}>
                                    <FilterSortBtn onClick={() => setOpen(!open)} className={styles.mr_16}>詳細検索</FilterSortBtn>
                                    <CreateLink to="/admin/news/create">新規登録</CreateLink>
                                </div>
                            </div>

                            <NewsTable news={news} deleteMethod={deleteData} csvOutputMethod={getCSVData} className={[styles.mb_16, styles.table_scroll_area].join(' ')} />
                            
                            <Pagination meta={data.meta} model={model} />
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default NewsIndex;



