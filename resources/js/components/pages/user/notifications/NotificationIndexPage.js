import React, {Suspense} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from '../../../hooks/useFetchApiData';
import Heading from '../../../atoms/Heading/Heading';
import styles from '../styles.module.css';
import NotificationList from '../../../molecules/NotificationList/NotificationList';

function NotificationIndexPage() {
    // urlの設定
    const baseUrl = `/api/user/notifications`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NOTIFICATION';
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const notifications = data.data? data.data: null;

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>お知らせ一覧</Heading>
                <div className={styles.main_contents_area}>
                    {   notifications &&
                        notifications.map((notification) =>
                            <NotificationList
                                key={notification.id}
                                notification={notification}
                            />
                        )
                    }
                </div>
            </Suspense>
        </main>
    );
}

export default NotificationIndexPage;



