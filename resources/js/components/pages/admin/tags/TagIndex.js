import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormWithBtn from '../../../molecules/Form/FormWithBtn';
import useNotify from '../../../context/NotifyContext'

function TagIndex() {
    // urlの設定
    const baseUrl = `/api/admin/tags`;
    // modelの設定
    const model = 'TAG';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData(baseUrl, model);
    // APIから取得したデータを変数に格納
    const tags = data.tags? data.tags: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'tag_name': ''});
    // 選択されたタグのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editTag, setEditTag] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);
    // notifyContextの呼び出し
    const confirm = useNotify();

    const handleNotifyDelete = async (id) => {
        // useNotifyにはpromiseを返却する関数なので返却値を受け取って処理を進める為にasyncでawaitを設定する
        const result = await confirm({
            body : '選択したタグを本当に削除してもよろしいですか?',
            confirmBtnLabel : '削除'
        });
        // resolveのfunctionで論理値が渡ってくるのそれを受け取って以下の処理をする
        if(result) {
            deleteData({ url: `/api/admin/tags/${id}`});
        }
    }

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>タグマスタ</Heading>
                    { errorMessage && <Text role='error' size='s'>{errorMessage.tag_name}</Text> }
                    <div className={styles.form_area}>
                        <FormWithBtn
                            name='tag_name'
                            value={formData.tag_name}
                            onChange={handleFormData}
                            placeholder='タグ名'
                            createMethod={() => createData({form: formData, url:'/api/admin/tags'}) }
                            className={styles.mb_24}
                        />
                        <div className={styles.master_form_area}>
                        {   tags &&
                            tags.map((tag) =>
                                <div key={tag.id} className={styles.master_text_area}>
                                    { tag.id === editableForm ? (
                                        <FormWithBtn
                                            name='tag_name'
                                            value={tag.tag_name}
                                            onChange={e => setEditTag(e.target.value)}
                                            placeholder='タグ名'
                                            updateMethod={() => 
                                                updateData({
                                                    url: `/api/admin/tags/${tag.id}`, 
                                                    form: {tag_name: `${editTag}`}
                                                })
                                            }
                                            deleteMethod={() => handleNotifyDelete(tag.id)}
                                        />
                                    ) : (
                                        <div className={styles.master_editable_text}onClick={() => {
                                            setEditTag(tag.tag_name);
                                            setEeditableForm(tag.id);
                                        }}>{tag.tag_name}</div>
                                    )}
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default TagIndex;



