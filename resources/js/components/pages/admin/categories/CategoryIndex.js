import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import Icon from '../../../atoms/Icon/Icon';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';
import useNotify from '../../../context/NotifyContext';

function CategoryIndex() {
    // urlの設定
    const baseUrl = `/api/admin/categories`;
    // modelの設定
    const model = 'CATEGORY';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const categories = data.categories? data.categories: null;
    // 選択されたカテゴリーのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);
    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleConfirmDelete = async () => {
        const result = await confirm({
            body : `選択カテゴリーを本当に削除しますか？`,
            confirmBtnLabel : '削除'
        });
        result && deleteData({url:`/api/admin/categories/${editableForm}`});
    } 

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>カテゴリーマスタ</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.category_name}</Text> }
                    { errorMessage && <Text role='error' size='s'>{errorMessage.parent_id}</Text> }
                    <div className={styles.form_area}>
                        <ul className={[styles.flex, styles.flex_wrap, styles.justify_evenly].join(' ')}>
                        {   categories && categories.map((category) =>
                            // gender category
                            <li key={category.id} className={styles.mb_24}>
                                { category.id === editableForm ? (
                                    <FormWithBtn
                                        name='category_name'
                                        placeholder='ジェンダーカテゴリー名'
                                        formInitialValue={{'category_name': category.category_name}}
                                        validateScope={'admin'}
                                        validateConfigKey={'category_request'}
                                        requestUrl={`/api/admin/categories/${editableForm}`}
                                        updateMethod={updateData}
                                        deleteMethod={handleConfirmDelete}
                                        className={styles.mb_8}
                                    />
                                ) : (
                                    <div className={[styles.category_text, styles.text_gender].join(' ')} onClick={() => setEeditableForm(category.id)}>{category.category_name}</div>
                                )}
                                <ul>
                                    {/* main category */}
                                    { category.children && category.children.map((child) =>
                                        <li key={child.id}>
                                            { child.id === editableForm ? (
                                                <FormWithBtn
                                                    name='category_name'
                                                    placeholder='メインカテゴリー名'
                                                    formInitialValue={{'category_name': child.category_name}}
                                                    validateScope={'admin'}
                                                    validateConfigKey={'category_request'}
                                                    requestUrl={`/api/admin/categories/${editableForm}`}
                                                    updateMethod={updateData}
                                                    deleteMethod={handleConfirmDelete}
                                                    className={styles.mb_8}
                                                />
                                            ) : (
                                                <>
                                                    <input id={`tab_${child.id}`} type='checkbox' name='tab' className={styles.tab} />
                                                    <label htmlFor={`tab_${child.id}`} className={styles.inline_flex}>
                                                        <Icon src='/img/arrow_right_icon.svg' className={styles.pulldown_img} />
                                                    </label>
                                                    <div className={[styles.category_text, styles.text_main].join(' ')} onClick={() => setEeditableForm(child.id)}>{child.category_name}</div>
                                                </>
                                            )
                                            }
                                            {/* sub category */}
                                            <ul className={styles.hidden}>
                                            {   child.grand_children && child.grand_children.map((grand_child) =>
                                                    <li key={grand_child.id}  className={styles.pl_32}>
                                                    { grand_child.id === editableForm ? (
                                                        <FormWithBtn
                                                            name='category_name'
                                                            placeholder='サブカテゴリー名'
                                                            formInitialValue={{'category_name': grand_child.category_name}}
                                                            validateScope={'admin'}
                                                            validateConfigKey={'category_request'}
                                                            requestUrl={`/api/admin/categories/${editableForm}`}
                                                            updateMethod={updateData}
                                                            deleteMethod={handleConfirmDelete}
                                                            className={styles.mb_8}
                                                        />
                                                    ) : (
                                                            <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')}>
                                                                <Icon src='/img/pull_down_icon.svg' className={styles.mr_8} />
                                                                <div className={[styles.category_text, styles.text_sub].join(' ')} onClick={() => setEeditableForm(grand_child.id)}>{grand_child.category_name}</div>
                                                            </div>
                                                    )}
                                                    </li>
                                                )}
                                                <li className={[styles.flex, styles.pl_64, styles.mb_8].join(' ')}>
                                                    <FormWithBtn
                                                        name='category_name'
                                                        placeholder='サブカテゴリー名'
                                                        formInitialValue={{'category_name': '', 'parent_id': child.id}}
                                                        validateScope={'admin'}
                                                        validateConfigKey={'category_request'}
                                                        requestUrl={'/api/admin/categories'}
                                                        createMethod={createData}
                                                    />
                                                </li>
                                            </ul>
                                        </li>
                                    )}
                                    <li className={[styles.flex, styles.mb_8, styles.pl_32].join(' ')}>
                                        <FormWithBtn
                                            name='category_name'
                                            placeholder='メインカテゴリー名'
                                            formInitialValue={{'category_name': '', 'parent_id': category.id}}
                                            validateScope={'admin'}
                                            validateConfigKey={'category_request'}
                                            requestUrl={'/api/admin/categories'}
                                            createMethod={createData}
                                        />
                                    </li>
                                </ul>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}


export default CategoryIndex;