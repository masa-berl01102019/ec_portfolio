import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../hooks/useFetchApiData";
import useInputCheckBox from "../../hooks/useInputCheckBox";
import usePaginate from "../../hooks/usePaginate";
import useSort from "../../hooks/useSort";
import useFilter from "../../hooks/useFilter";
import {useCreateUrl} from "../../hooks/useCreateUrl";
import ShowErrorMsg from "../../ShowErrorMsg";
import { useParamsContext } from '../../context/ParamsContext';

// TODO 削除後に再取得のAPIを叩く仕様をやめるか要検討
// TODO 管理者氏名でソート機能の実装
// TODO テーブルで最終更新者の表示
// 注意事項　API通信で取得したデータもform部品から値を取得する時は文字列で渡ってくるのでデータ型をキャストしないと想定外の挙動になるので注意する　＊typesScriptの導入要検討

function NotificationIndex() {

    // urlの設定
    const baseUrl = `/api/admin/notifications`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NOTIFICATION';
    // paginateフックの呼び出し
    const { handlePageChange, handleTableRow} = usePaginate();
    // sortフックの呼び出し
    const {handleSort} = useSort();
    // filterフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilterInputText, handleFilterCheckbox, handleFilterDateRange}] = useFilter();
    // checkboxフックの呼び出し
    const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const notifications = data.notifications? data.notifications.data: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('NOTIFICATIONにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'expired_at' : '', 'posted_at' : '', 'modified_at' : ''},
                filter: { 'keyword' : '', 'is_published' : [], 'dateRange': {} },
                // paginate: {
                //     data: null, // 取得したデータ
                //     current_page: 1, // 現在のページ
                //     per_page: 20, // 1ページ当たりの取得件数
                //     total: 0, // 総件数
                //     page_range_displayed: 5// ページネーションの表示個数
                // }
            });
            setScope(model);
        }
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.delete && data.delete === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: useCreateUrl(baseUrl, params) });
            // ステートの配列を初期化
            setChecklist([]);
        }
    },[data]);

    // 描画のみを担当
    return (
        <div style={{'overflowX': 'hidden', 'width': '90%', 'margin': '0 auto'}}>
            <h1>お知らせ一覧</h1>
            { errorMessage && <ShowErrorMsg errorMessage={errorMessage}/> }
            {   isLoading ? (
                    <CircularProgress disableShrink />
                ): (
                    <>
                        <button onClick={() => {
                            let answer = confirm(`選択項目${checklist.length}件を解除しますか？`);
                            answer && handleUnCheckAll();
                        }}>選択解除</button>
                        <button onClick={ () => {
                            let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
                            answer && dispatch({type:'DELETE', url:`/api/admin/notifications/delete`, form:checklist});
                        }}>一括削除</button>
                        <button onClick={ () => {
                                dispatch({ type:'CREATE', url:`/api/admin/notifications/csv`, form:checklist })
                        }}>CSV出力</button>

                        {   Object.keys(params.filter).length > 0 &&　scope === model &&

                            <div style={{'marginTop': '10px'}}>
                                <p style={{'marginBottom': '8px', 'fontWeight': 'bold'}}>フィルター機能</p>
                                <div style={{'marginBottom': '8px'}}>
                                    <span style={{'marginRight': '20px'}}>キーワード検索</span>
                                    <input type='text' name='keyword' onBlur={handleFilterInputText} defaultValue={params.filter.keyword} />
                                </div>
                                <div>
                                    <span style={{'marginRight': '20px'}}>公開状況</span>
                                    <label><input type='checkbox' name='is_published' onChange={handleFilterCheckbox} value={0} checked={params.filter.is_published.includes(0)} />非公開</label>
                                    <label><input type='checkbox' name='is_published' onChange={handleFilterCheckbox} value={1} checked={params.filter.is_published.includes(1)} />公開中</label>
                                </div>
                                <div>
                                    <span style={{'marginRight': '20px'}}>期間指定</span>
                                    <select name='field' ref={dateRangeField} value={Object.keys(params.filter.dateRange)[0]} onChange={handleFilterDateRange}>
                                        <option value={'clear'}>フィールド選択</option>
                                        <option value={'expired_at'}>掲載終了日</option>
                                        <option value={'posted_at'}>投稿日</option>
                                        <option value={'modified_at'}>更新日</option>
                                    </select>
                                    <input type='number' name='start' ref={dateRangeStart} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][0]: ''} placeholder={'19500101'} />　〜
                                    <input type='number' name='end' ref={dateRangeEnd} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][1]: ''} placeholder={'1980101'} />
                                </div>
                            </div>
                        }

                        {   Object.keys(params.sort).length > 0 && scope === model &&

                            <div style={{'marginTop': '10px'}}>
                                <p style={{'marginBottom': '5px', 'fontWeight': 'bold'}}>ソート機能</p>
                                {/*<label>管理者氏名(カナ)*/}
                                {/*    <select name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort}>*/}
                                {/*        <option value={''}>未選択</option>*/}
                                {/*        <option value={'desc'}>降順</option>*/}
                                {/*        <option value={'asc'}>昇順</option>*/}
                                {/*    </select>*/}
                                {/*</label>*/}
                                <label>掲載終了日
                                    <select name='expired_at' value={params.sort.expired_at} onChange={handleSort}>
                                        <option value={''}>未選択</option>
                                        <option value={'desc'}>降順</option>
                                        <option value={'asc'}>昇順</option>
                                    </select>
                                </label>
                                <label>投稿日
                                    <select name='posted_at' value={params.sort.posted_at} onChange={handleSort}>
                                        <option value={''}>未選択</option>
                                        <option value={'desc'}>降順</option>
                                        <option value={'asc'}>昇順</option>
                                    </select>
                                </label>
                                <label>更新日
                                    <select name='modified_at' value={params.sort.modified_at} onChange={handleSort}>
                                        <option value={''}>未選択</option>
                                        <option value={'desc'}>降順</option>
                                        <option value={'asc'}>昇順</option>
                                    </select>
                                </label>
                            </div>
                        }

                        <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                            <thead>
                                <tr>
                                    <th><button onClick={() => { handleCheckAll(notifications) }}>全選択</button></th>
                                    <th>ID</th>
                                    <th>編集</th>
                                    <th>公開状況</th>
                                    <th>タイトル</th>
                                    {/*<th>最終更新者</th>*/}
                                    <th>掲載終了日</th>
                                    <th>投稿日</th>
                                    <th>更新日</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                // 最初にUserIndex() -> DataFetchApi() -> UserIndex() と呼び出されてる間でも先に描画が走るがdata.notificationsは空なのでエラーになってしまう
                                // なのでdata.notificationsがあれば表示すると条件をつければいい
                                notifications && !errorMessage &&
                                notifications.map((notification) =>
                                    <tr key={notification.id}>
                                        {/* ページネーションで別のページに遷移した際にチェックが外れてしまわないようにlist.includes()でステートの配列に含まれてる値IDとユーザーのIDが一致する時にチェックがつくようにセット */}
                                        <td><input type='checkbox' onChange={handleCheck} value={notification.id} checked={ checklist.includes(notification.id) } /></td>
                                        <td>{notification.id}</td>
                                        <td><Link to={`/admin/notifications/${notification.id}/edit`}>編集</Link></td>
                                        <td>{notification.ac_is_published}</td>
                                        <td>{notification.title}</td>
                                        {/*<td>{notification.admin_id}</td>*/}
                                        <td>{notification.expired_at}</td>
                                        <td>{notification.posted_at}</td>
                                        <td>{notification.modified_at}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        { data.notifications &&
                            <>
                                <label>行数<input type='number' onBlur={handleTableRow} defaultValue={data.notifications.per_page} style={{'width': '40px'}} /></label>
                                <div>検索結果{data.notifications.total}</div>
                                <div>現在のページ{data.notifications.current_page}</div>
                                <Pagination
                                    activePage={data.notifications.current_page}
                                    itemsCountPerPage={data.notifications.per_page}
                                    totalItemsCount={data.notifications.total}
                                    pageRangeDisplayed={data.notifications.page_range_displayed}
                                    onChange={handlePageChange}
                                />
                            </>
                        }
                    </>
                )
            }
        </div>
    );
}

export default NotificationIndex;


