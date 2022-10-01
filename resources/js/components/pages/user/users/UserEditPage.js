import React, {Suspense, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useToggle from "../../../hooks/useToggle";
import FormInputText from '../../../molecules/FormInputText/FormInputText';
import Badge from '../../../atoms/Badge/Badge';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import DatePicker from '../../../atoms/DatePicker/DatePicker';
import InputRadio from '../../../atoms/InputRadio/InputRadio';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

// TODO: パスワードはメールアドレスの認証なしに変更出来ない使用にするので後で実装する

function UserEditPage() {
    // urlの設定
    const baseUrl = `/api/user/users/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'USER';
    // APIと接続して返り値を取得
    const {data, errorMessage, updateData} = useFetchApiData2(baseUrl, model);
    // チェックボックスのclickイベントで配送先住所のフォームの表示と非表示を管理
    const [toggle, {handleToggle}] = useToggle(false);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData, handleFormDate}] = useForm({
        'id': null,
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'gender': null, // 0:man 1:woman 2:others 3:no answer
        'birthday': null,
        'post_code': null,
        'prefecture': null,
        'municipality': null,
        'street_name': null,
        'street_number': null,
        'building': null,
        'delivery_post_code': null,
        'delivery_prefecture': null,
        'delivery_municipality': null,
        'delivery_street_name': null,
        'delivery_street_number': null,
        'delivery_building': null,
        'tel': null,
        'email': null,
        'is_received': null, // 0: 受取NG 1: 受取OK
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // API接続の返却値を変数に格納
    const user = data.user;

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にuserが入ってこない場合があるので条件分岐してあげる
        if(user) {
            // フォームのデフォルト値を設定するためにsetUserInfoで値をセット
            setFormData({...user});
        }
    },[]);

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
                            会員編集
                        </Heading>
                        <div className={styles.form_contents_area}>
                            <form onSubmit={ e => {
                                e.preventDefault();
                                updateData({
                                    form: formData,
                                    url: `/api/user/users/${formData.id}`,
                                    callback: () => history.push('/')
                                    // TODO: 名前変更した際にヘッダーの名前が変わってない点を修正 Router.jsを再呼び出しする必要あり
                                });
                            }}>
                                <div className={styles.mb_16}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')} >
                                        <Text className={styles.mr_4}>氏名</Text>
                                        <Badge text='必須' />
                                    </div>
                                    <div className={styles.flex}>
                                        <div className={[styles.mr_24, styles.flex_basis_50].join(' ')}>
                                            <FormInputText
                                                name={'last_name'}
                                                onBlur={handleFormData}
                                                value={formData.last_name}
                                                error={errorMessage}
                                                placeholder='山田'
                                                style={{'width': '100%'}}
                                            />
                                        </div>
                                        <div className={styles.flex_basis_50}>
                                            <FormInputText
                                                name={'first_name'}
                                                onBlur={handleFormData}
                                                value={formData.first_name}
                                                error={errorMessage}
                                                placeholder='太郎'
                                                style={{'width': '100%'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.mb_16}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')} >
                                        <Text className={styles.mr_4}>氏名(カナ)</Text>
                                        <Badge text='必須' />
                                    </div>
                                    <div className={styles.flex}>
                                        <div className={[styles.mr_24, styles.flex_basis_50].join(' ')}>
                                            <FormInputText 
                                                name={'last_name_kana'} 
                                                onBlur={handleFormData} 
                                                value={formData.last_name_kana} 
                                                error={errorMessage} 
                                                placeholder='ヤマダ'
                                                style={{'width': '100%'}}
                                            />
                                        </div>
                                        <div className={styles.flex_basis_50}>
                                            <FormInputText
                                                name={'first_name_kana'}
                                                onBlur={handleFormData}
                                                value={formData.first_name_kana}
                                                error={errorMessage}
                                                placeholder='タロウ'
                                                style={{'width': '100%'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.mb_16}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')} >
                                        <Text className={styles.mr_4}>性別</Text>
                                        <Badge text='必須' />
                                    </div>
                                    <div className={[styles.mb_8, styles.flex].join(' ')}>
                                        <label className={[styles.flex, styles.align_center ].join(' ')}>
                                            <InputRadio 
                                                name='gender' 
                                                onChange={handleFormData}
                                                value={0} 
                                                checked={formData.gender == 0}
                                            />
                                            <Text className={styles.ml_8}>男性</Text>
                                        </label>
                                        <label className={[styles.flex, styles.align_center, styles.ml_16 ].join(' ')}>
                                            <InputRadio 
                                                name='gender' 
                                                onChange={handleFormData} 
                                                value={1} 
                                                checked={formData.gender == 1}
                                            />
                                            <Text className={styles.ml_8}>女性</Text>
                                        </label>
                                        <label className={[styles.flex, styles.align_center, styles.ml_16 ].join(' ')}>
                                            <InputRadio 
                                                name='gender' 
                                                onChange={handleFormData} 
                                                value={2} 
                                                checked={formData.gender == 2}
                                            />
                                            <Text className={styles.ml_8}>その他</Text>
                                        </label>
                                        <label className={[styles.flex, styles.align_center, styles.ml_16 ].join(' ')}>
                                            <InputRadio 
                                                name='gender' 
                                                onChange={handleFormData} 
                                                value={3} 
                                                checked={formData.gender == 3}
                                            />
                                            <Text className={styles.ml_8}>未回答</Text>
                                        </label>
                                    </div>
                                    { errorMessage && <Text role='error' size='s'>{errorMessage.gender}</Text> }
                                </div>
                                <div className={styles.mb_16}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')} >
                                        <label htmlFor='birthday' className={styles.mr_4}><Text>生年月日</Text></label>
                                        <Badge text='必須' />
                                    </div>
                                    <div className={styles.mb_8}>
                                        <DatePicker name={'birthday'} value={formData.birthday} onChange={handleFormDate} />
                                    </div>
                                    { errorMessage && <Text role='error' size='s'>{errorMessage.birthday}</Text> }
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'post_code'}
                                        type={'number'}
                                        onBlur={handleFormData}
                                        value={formData.post_code}
                                        label={'郵便番号'}
                                        error={errorMessage}
                                        placeholder='1234567'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'prefecture'}
                                        onBlur={handleFormData}
                                        value={formData.prefecture}
                                        label={'都道府県'}
                                        error={errorMessage}
                                        placeholder='神奈川県'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'municipality'}
                                        onBlur={handleFormData}
                                        value={formData.municipality}
                                        label={'市区町村郡'}
                                        error={errorMessage}
                                        placeholder='川崎市麻生区'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'street_name'}
                                        onBlur={handleFormData}
                                        value={formData.street_name}
                                        label={'町名'}
                                        error={errorMessage}
                                        placeholder='千代ヶ丘'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'street_number'}
                                        onBlur={handleFormData}
                                        value={formData.street_number}
                                        label={'町目番地'}
                                        error={errorMessage}
                                        placeholder='1-1-1'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'building'}
                                        onBlur={handleFormData}
                                        value={formData.building}
                                        label={'建物名'}
                                        error={errorMessage}
                                        placeholder='○☓△ビルディング 1F'
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <label className={styles.flex}>
                                        <InputCheckbox onChange={handleToggle} checked={toggle} />
                                        <Text className={styles.ml_8}>配送先に別の住所を指定する</Text>
                                    </label>
                                </div>
                                <div className={toggle? styles.block : styles.hidden}>
                                    <div className={styles.mb_16}>
                                        <FormInputText
                                            name={'delivery_post_code'}
                                            type={'number'}
                                            onBlur={handleFormData}
                                            value={formData.delivery_post_code}
                                            label={'郵便番号'}
                                            error={errorMessage}
                                            placeholder='1234567'
                                        />
                                    </div>
                                    <div className={styles.mb_16}>
                                        <FormInputText
                                            name={'delivery_prefecture'}
                                            onBlur={handleFormData}
                                            value={formData.delivery_prefecture}
                                            label={'都道府県'}
                                            error={errorMessage}
                                            placeholder='神奈川県'
                                        />
                                    </div>
                                    <div className={styles.mb_16}>
                                        <FormInputText
                                            name={'delivery_municipality'}
                                            onBlur={handleFormData}
                                            value={formData.delivery_municipality}
                                            label={'市区町村郡'}
                                            error={errorMessage}
                                            placeholder='川崎市麻生区'
                                        />
                                    </div>
                                    <div className={styles.mb_16}>
                                        <FormInputText
                                            name={'delivery_street_name'}
                                            onBlur={handleFormData}
                                            value={formData.delivery_street_name}
                                            label={'町名'}
                                            error={errorMessage}
                                            placeholder='千代ヶ丘'
                                        />
                                    </div>
                                    <div className={styles.mb_16}>
                                        <FormInputText
                                            name={'delivery_street_number'}
                                            onBlur={handleFormData}
                                            value={formData.delivery_street_number}
                                            label={'町目番地'}
                                            error={errorMessage}
                                            placeholder='1-1-1'
                                        />
                                    </div>
                                    <div className={styles.mb_16}>
                                        <FormInputText
                                            name={'delivery_building'}
                                            onBlur={handleFormData}
                                            value={formData.delivery_building}
                                            label={'建物名'}
                                            error={errorMessage}
                                            placeholder='○☓△ビルディング 1F'
                                        />
                                    </div>
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'tel'}
                                        type='tel'
                                        onBlur={handleFormData}
                                        value={formData.tel}
                                        label={'電話番号'}
                                        error={errorMessage}
                                        placeholder='080-1234-5678'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_16}>
                                    <FormInputText
                                        name={'email'}
                                        type={'email'}
                                        onBlur={handleFormData}
                                        value={formData.email}
                                        label={'メールアドレス'}
                                        error={errorMessage}
                                        placeholder='test@example.com'
                                        required={true}
                                    />
                                </div>
                                <div className={styles.mb_40}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')} >
                                        <Text className={styles.mr_4}>DM登録</Text>
                                        <Badge text='必須' />
                                    </div>
                                    <div className={[styles.mb_8, styles.flex].join(' ')}>
                                        <label className={[styles.flex, styles.align_center ].join(' ')}>
                                            <InputRadio 
                                                name='is_received' 
                                                onChange={handleFormData}
                                                value={1} 
                                                checked={formData.is_received == 1}
                                            />
                                            <Text className={styles.ml_8}>登録する</Text>
                                        </label>
                                        <label className={[styles.flex, styles.align_center, styles.ml_32 ].join(' ')}>
                                            <InputRadio 
                                                name='is_received' 
                                                onChange={handleFormData} 
                                                value={0} 
                                                checked={formData.is_received == 0}
                                            />
                                            <Text className={styles.ml_8}>登録しない</Text>
                                        </label>
                                    </div>
                                    { errorMessage && <Text role='error' size='s'>{errorMessage.is_received}</Text> }
                                </div>
                                <div className={[styles.flex, styles.align_center, styles.justify_center, styles.mb_40].join(' ')}>
                                    <LinkBtn to={`/`} className={[styles.mr_8, styles.btn_max].join(' ')} >キャンセル</LinkBtn>
                                    <Button color='primary' type="submit" className={[styles.ml_8, styles.btn_max].join(' ')}>更新する</Button>
                                </div>
                                <Link 
                                    to={{pathname: '/users/delete', state: formData.id}} 
                                    className={styles.delete_link}
                                >
                                    退会手続きはこちら
                                </Link>
                            </form>
                        </div>
                    </>
                )
            }
            </Suspense>
        </main>
    );
}

export default UserEditPage;