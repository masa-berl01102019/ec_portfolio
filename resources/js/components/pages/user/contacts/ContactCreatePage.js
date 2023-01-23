import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";

function ContactCreatePage() {

    // urlの設定
    const baseUrl = `/api/user/contacts`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useForm({
        'last_name': null, 
        'first_name': null, 
        'last_name_kana': null, 
        'first_name_kana': null, 
        'tel': null, 
        'email': null, 
        'title': null, 
        'body': null, 
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();

    useEffect(() => {
        if(data.create === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/');
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div style={{'width': '50%', 'margin': '0 auto'}}>
                <h1>お問い合わせ</h1>
                <form onSubmit={ e => {
                    e.preventDefault();
                    dispatch({type: 'CREATE', form: formData, url: `/api/user/contacts` });
                }}>
                    <div>氏名</div>
                    <div>
                        <input type='text' name='last_name' onBlur={handleFormData} defaultValue={formData.last_name} placeholder='山田'/>
                        <input type='text' name='first_name' onBlur={handleFormData} defaultValue={formData.first_name} placeholder='太郎'/>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.last_name}</p> }
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.first_name}</p> }
                    </div>
                    <div>氏名(カナ)</div>
                    <div>
                        <input type='text' name='last_name_kana' onBlur={handleFormData} defaultValue={formData.last_name_kana} placeholder='ヤマダ' />
                        <input type='text' name='first_name_kana' onBlur={handleFormData} defaultValue={formData.first_name_kana} placeholder='タロウ' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.last_name_kana}</p> }
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.first_name_kana}</p> }
                    </div>
                    <label htmlFor='tel'>電話番号</label>
                    <div>
                        <input id="tel" type='tel' name='tel' onBlur={handleFormData} defaultValue={formData.tel} placeholder='08012345678' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.tel}</p> }
                    </div>
                    <label htmlFor='email'>メールアドレス</label>
                    <div>
                        <input id="email" type='email' name='email' onBlur={handleFormData} defaultValue={formData.email} placeholder='yamada@example.example.com' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.email}</p> }
                    </div>
                    <div>
                        <div>タイトル</div>
                        <input type='text' name='title' onBlur={handleFormData} defaultValue={formData.title} placeholder='タイトル名'/>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.title}</p> }
                    </div>
                    <div>
                        <div>本文</div>
                        <textarea name='body' onBlur={handleFormData} defaultValue={formData.body} placeholder='本文' style={{'minWidth': '448px', 'minHeight': '300px'}} />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.body}</p> }
                    </div>

                    <button><Link to={`/`}>一覧に戻る</Link></button>
                    <button type="submit">お問い合わせする</button>
                </form>
            </div>
        )
    );
}

export default ContactCreatePage;